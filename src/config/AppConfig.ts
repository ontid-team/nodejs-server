import { BaseConfig } from '../core/lib/BaseConfig';
import {
  ENV_DEVELOPMENT,
  ENV_PRODUCTION,
  ENV_STAGING,
  ENV_TEST,
} from '../utils/constants';

class AppConfig extends BaseConfig {
  nodeEnv: 'development' | 'production' | 'staging' | 'test';
  port: number;
  host: string;
  name: string;
  startTime: number;
  formatDate: string;
  countriesBloked: string[];

  constructor() {
    super();
    this.nodeEnv = this.set(
      'NODE_ENV',
      v => [ENV_DEVELOPMENT, ENV_PRODUCTION, ENV_STAGING, ENV_TEST].includes(v),
      ENV_DEVELOPMENT
    );
    this.port = this.set('APP_PORT', this.joi.number().port().required(), 5555);
    this.host = this.set(
      'APP_HOST',
      this.joi.string().required(),
      'http://localhost'
    );
    this.name = this.set(
      'APP_NAME',
      this.joi.string().required(),
      'edgescreen-backend'
    );

    this.startTime = +this.set(
      'APP_SHOOT_START_TIME',
      this.joi.number().required(),
      30
    );

    this.formatDate = 'MM-dd-yyyy, hh:mm a';

    const appCountriesBloked = this.set(
      'APP_COUNTRIES_BLOCKED',
      this.joi.string(),
      'none'
    );
    this.countriesBloked =
      appCountriesBloked === 'none' ? [] : appCountriesBloked.split(',');
  }
}

export const appConfig = new AppConfig();
