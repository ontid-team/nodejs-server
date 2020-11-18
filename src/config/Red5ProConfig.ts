import { BaseConfig } from '../core/lib/BaseConfig';

class Red5ProConfig extends BaseConfig {
  streammanagerHost: string;
  proxyHost: string;
  proxyPort: string;
  rtmpPort: number;
  webScope: string;
  wsPort: number;
  accessToken: string;

  constructor() {
    super();
    this.rtmpPort = +this.set(
      'RED_5_PRO_RTMP_PORT',
      this.joi.number().required(),
      1935
    );
    this.wsPort = +this.set(
      'RED_5_PRO_WS_PORT',
      this.joi.number().required(),
      1935
    );

    this.streammanagerHost = this.set(
      'RED_5_PRO_STREAMMANAGER_HOST',
      this.joi.string().required(),
      '127.0.0.1'
    );

    this.proxyHost = this.set(
      'RED_5_PRO_STREAMMANAGER_PROXY_HOST',
      this.joi.string().required(),
      '127.0.0.1'
    );

    this.proxyPort = this.set(
      'RED_5_PRO_STREAMMANAGER_PROXY_PORT',
      this.joi.number().required(),
      80
    );
    this.webScope = this.set('RED_5_PRO_WEB_SCOPE', this.joi.string(), '');

    this.accessToken = this.set(
      'RED_5_PRO_ACCESS_TOKEN',
      this.joi.string().required(),
      '123456'
    );
  }
}

export const red5ProConfig = new Red5ProConfig();
