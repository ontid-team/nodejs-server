import { Logger } from './lib/Logger';
import { config } from '../config';

export default new Logger({
  appName: config.appConfig.name,
});
