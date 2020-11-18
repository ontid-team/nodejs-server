import { Red5ProService } from '../red5Pro/red5Pro.service';

export class ServerService {
  static async getStatistic() {
    const listWithStatsFromRed5pro = await Red5ProService.getListStats();

    return {
      serverConnection: listWithStatsFromRed5pro.reduce(
        (acc, cur) => acc + cur.currentSubscribers,
        0
      ),
    };
  }
}
