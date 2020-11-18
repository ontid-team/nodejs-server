import pino from 'pino';
import { config } from '../../config';
import { Assert as assert } from './assert';
import { SentryCatch } from './SentryCatch';
import { ENV_TEST } from '../../utils/constants';

const $ = Symbol('private scope');
/**
 * Logger information
 */
export class Logger {
  constructor({
    appName,
    capture = false,
    sentryDns = undefined,
    raw = false,
  }) {
    assert.string(appName, { required: true });
    assert.boolean(capture);
    assert.string(sentryDns);
    if (capture && !sentryDns) {
      throw new Error(
        `${this.constructor.name}: Please define "sentryDns" param`
      );
    }

    this[$] = {
      sentryCatch: capture ? new SentryCatch(sentryDns) : null,

      fatalLogger: pino({
        name: `${appName.toLowerCase()}::fatal`,
        prettyPrint: {
          errorLikeObjectKeys: ['err', 'error'],
          ...(!raw && { translateTime: 'SYS:standard' }),
        },
      }),
      errorLogger: pino({
        name: `${appName.toLowerCase()}::error`,
        prettyPrint: {
          errorLikeObjectKeys: ['err', 'error'],
          ...(!raw && { translateTime: 'SYS:standard' }),
        },
      }),
      warnLogger: pino({
        name: `${appName.toLowerCase()}::warn`,
        ...(!raw && { prettyPrint: { translateTime: 'SYS:standard' } }),
      }),
      infoLogger: pino({
        name: `${appName.toLowerCase()}::info`,
        ...(!raw && { prettyPrint: { translateTime: 'SYS:standard' } }),
      }),
      debugLogger: pino({
        // level: '20',
        name: `${appName.toLowerCase()}::debug`,
        ...(!raw && { prettyPrint: { translateTime: 'SYS:standard' } }),
      }),
      traceLogger: pino({
        // level: '10',
        name: `${appName.toLowerCase()}::trace`,
        ...(!raw && { prettyPrint: { translateTime: 'SYS:standard' } }),
      }),
    };
  }

  /**
   * Fatal error
   *
   * @param message
   * @param error
   * @param meta
   */
  fatal(message, error, meta?) {
    assert.string(message, { required: true });
    assert.isOk(error, { required: true });
    assert.object(meta);

    if (config.appConfig.nodeEnv !== ENV_TEST) {
      if (this[$].sentryCatch) {
        this[$].sentryCatch.captureException(error, meta);
      }
      this[$].fatalLogger.fatal(message, meta || error.toString());
    }
  }

  /**
   * Error
   *
   * @param message
   * @param error
   * @param meta
   */
  error(message, error, meta?) {
    assert.string(message, { required: true });
    assert.isOk(error, { required: true });
    assert.object(meta);

    if (config.appConfig.nodeEnv !== ENV_TEST) {
      if (this[$].sentryCatch) {
        this[$].sentryCatch.captureException(error, meta);
      }
      this[$].errorLogger.error(message, meta || error.toString());
    }
  }

  /**
   * Warn
   *
   * @param message
   * @param error
   * @param meta
   */
  warn(message, error, meta?) {
    assert.string(message, { required: true });
    assert.isOk(error, { required: true });
    assert.object(meta);

    if (config.appConfig.nodeEnv !== ENV_TEST) {
      if (this[$].sentryCatch) {
        this[$].sentryCatch.captureException(error, meta);
      }
      this[$].warnLogger.warn(message, meta || error.toString());
    }
  }

  /**
   * Info
   *
   * @param message
   * @param meta
   */
  info(message, meta = {}) {
    assert.string(message, { required: true });
    assert.isOk(meta);

    if (config.appConfig.nodeEnv !== ENV_TEST) {
      if (this[$].sentryCatch) {
        this[$].sentryCatch.captureMessage(message, meta);
      }
      this[$].infoLogger.info(message, Object.keys(meta).length ? meta : '');
    }
  }

  /**
   * Debug
   *
   * @param message
   * @param meta
   */
  debug(message, meta = {}) {
    assert.string(message, { required: true });
    assert.isOk(meta);

    if (config.appConfig.nodeEnv !== ENV_TEST) {
      this[$].debugLogger.trace(message, Object.keys(meta).length ? meta : '');
    }
  }

  /**
   * Trace
   *
   * @param message
   * @param meta
   */
  trace(message, meta = {}) {
    assert.string(message, { required: true });
    assert.isOk(meta);

    if (config.appConfig.nodeEnv !== ENV_TEST) {
      this[$].traceLogger.trace(message, Object.keys(meta).length ? meta : '');
    }
  }
}
