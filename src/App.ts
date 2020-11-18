import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaQs from 'koa-qs';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import { Assert as assert } from './core/lib/assert';
import { BaseMiddleware } from './core/lib';
import { Logger } from './core/lib/Logger';
import { router } from './router';

export class App {
  private port: number;
  private middleware;
  private errorMiddleware;
  private logger: Logger;

  constructor({ port, middleware, errorMiddleware, logger }) {
    assert.integer(port, { required: true, positive: true });
    assert.array(middleware, {
      required: true,
      notEmpty: true,
      message: 'middleware param expects not empty array',
    });
    assert.instanceOf(errorMiddleware, BaseMiddleware);
    assert.instanceOf(logger, Logger);

    this.port = port;
    this.middleware = middleware;
    this.errorMiddleware = errorMiddleware;
    this.logger = logger;
  }

  start() {
    this.logger.info('Server start initialization...');

    return new Promise(async (resolve, reject) => {
      const app = new Koa();

      app.proxy = true;

      koaQs(app);
      app.use(helmet());
      app.use(cors({ maxAge: 3600, credentials: true }));
      app.use(bodyParser());

      /**
       * error handler
       */
      try {
        await this.errorMiddleware.init();
        app.use(this.errorMiddleware.handler());
      } catch (e) {
        return reject(`Default error middleware failed. ${e}`);
      }

      app.use(router());

      process.on('unhandledRejection', (reason, promise) => {
        this.logger.error('unhandledRejection', reason);
      });

      process.on('rejectionHandled', promise => {
        this.logger.warn('rejectionHandled', promise);
      });

      process.on('multipleResolves', (type, promise, reason) => {
        this.logger.error('multipleResolves', { type, promise, reason });
      });

      process.on('uncaughtException', error => {
        this.logger.fatal('uncaughtException', error.stack);
        process.exit(1);
      });

      return app.listen(this.port, () => resolve({ port: this.port }));
    });
  }
}
