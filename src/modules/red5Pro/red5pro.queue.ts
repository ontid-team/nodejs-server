import ms from 'ms';
import Bull from 'bull';
import { ObjectId } from 'mongodb';
import { redisConfig } from '../../config/RedisConfig';
import { appConfig } from '../../config/AppConfig';
import logger from '../../core/Logger';
import { eventEmiter } from '../../utils/eventEmiter';
import { ShootService } from '../shoot/shoot.service';
import { Red5ProService } from './red5Pro.service';
import { FullShoot } from '../shoot/shoot.type';

export const red5proQueue = new Bull('red5proQueue', {
  redis: {
    port: redisConfig.port,
    host: redisConfig.host,
    password: redisConfig.password,
  },
  prefix: appConfig.name,
  limiter: { max: 30, duration: 5000 },
});

eventEmiter.once('close', () => {
  red5proQueue.close();
});

red5proQueue.on('error', logger.error);

eventEmiter.once('start', async () => {
  red5proQueue.process(
    'killShoot',
    async (job: Bull.Job<Pick<FullShoot, '_id'>>) => {
      try {
        const shootFromDb = await ShootService.getShootById(
          { _id: new ObjectId(job.data._id) },
          {}
        );

        if (shootFromDb === null) {
          throw new Error('Shoot didnt find');
        }

        const result = await Red5ProService.killRTSPStream({
          streamAddress: shootFromDb.streamAddress,
          streamKey: shootFromDb.streamKey,
        });

        if (
          result.message !== 'Stream killed' &&
          result.message !== 'Stream with scopename and outputname not found'
        ) {
          throw new Error(result);
        }

        await job.progress(100);
        return Promise.resolve(result);
      } catch (err) {
        logger.error('red5proQueue killShoot', err);
        return Promise.reject(err);
      }
    }
  );
});
