import { RouterContext } from 'koa-router';
import { BaseMiddleware } from '../lib';
import logger from '../Logger';
import { config } from '../../config';

class InitMiddleware extends BaseMiddleware {
  /**
   * Init controller
   */
  async init() {
    logger.trace(`${this.constructor.name} initialized...`);
  }

  /**
   * Handler
   *
   * @returns {Function}
   */
  handler() {
    return (ctx: RouterContext, next: Function) => {
      ctx.set('Server', config.appConfig.name);
      next();
    };
  }
}

export default new InitMiddleware();
