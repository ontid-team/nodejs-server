import { App } from './App';
import middleware from './core/middleware';
import errorMiddleware from './core/middleware/error';
import logger from './core/Logger';
import { config } from './config';
import mongoDb from '../src/db/index';
import { eventEmiter } from './utils/eventEmiter';

const app = new App({
  port: Number(config.appConfig.port),
  middleware,
  errorMiddleware,
  logger,
});

app
  .start()
  .then(serverParams => {
    logger.info(`Server initialized...`, serverParams);
    logger.trace('Configs');
    logger.trace('App config:', config.appConfig);
  })
  .catch(error => logger.error('Server fails to initialize...', error))
  .then(() => mongoDb.getDbConections())
  .then(() => {
    logger.trace('--- Database ---');
    logger.trace('Database initialized...', mongoDb.getMongoConfig());
  })
  .catch(error => {
    eventEmiter.emit('close');
    logger.error('Database fails to initialize...', error);
    process.exit(1);
  });
