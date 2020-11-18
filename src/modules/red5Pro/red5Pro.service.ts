import { nanoid } from 'nanoid';
import axios from 'axios';
import { red5ProConfig } from '../../config/Red5ProConfig';
import {
  GetCoderInfoResponse,
  GetStatisticsResponse,
  KillStream,
} from './red5Pro.type';
import { FullShoot } from '../shoot/shoot.type';

export class Red5ProService {
  static async getInfoForCoder() {
    const streamKey = nanoid();
    const { data } = await axios.get<GetCoderInfoResponse>(
      `${red5ProConfig.streammanagerHost}/streammanager/api/4.0/event/${red5ProConfig.webScope}/${streamKey}?action=broadcast`
    );

    return {
      streamKey: data.name,
      streamAddress: data.serverAddress,
      scope: data.scope,
      port: red5ProConfig.rtmpPort,
    };
  }

  static async getStreamByStreamKey(shoot: Pick<FullShoot, 'streamKey'>) {
    const { data } = await axios.get<GetCoderInfoResponse>(
      `${red5ProConfig.streammanagerHost}/streammanager/api/4.0/event/${red5ProConfig.webScope}/${shoot.streamKey}?action=subscribe`
    );
    return {
      host: data.serverAddress,
      port: red5ProConfig.wsPort,
      app: data.scope,
      proxyPort: red5ProConfig.proxyPort,
      proxyHost: red5ProConfig.proxyHost,
    };
  }

  static async getStatisticByStreamKey(shoot: Pick<FullShoot, 'streamKey'>) {
    const { data } = await axios.get<GetStatisticsResponse>(
      `${red5ProConfig.streammanagerHost}/streammanager/api/4.0/event/${red5ProConfig.webScope}/${shoot.streamKey}/stats`
    );
    return data;
  }

  static async getViewiersCount(shoot: Pick<FullShoot, 'streamKey'>) {
    const streamStatistic = await this.getStatisticByStreamKey({
      streamKey: shoot.streamKey,
    });

    return streamStatistic.reduce(
      (acc, cur) => acc + cur.currentSubscribers,
      0
    );
  }

  static async isMaxViewers(
    shoot: Pick<FullShoot, 'streamKey' | 'maxViewers'>
  ) {
    const viewersCount = await this.getViewiersCount({
      streamKey: shoot.streamKey,
    });

    if (viewersCount < shoot.maxViewers) {
      return false;
    }
    return true;
  }
}
