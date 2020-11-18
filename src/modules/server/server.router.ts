import Router from 'koa-router';
import { ServerController } from './server.controller';
import { asyncMiddleware } from '../../core/middleware/AsyncMiddleware';
import { checkAccessToken } from '../../core/middleware/checkAccessToken';

export const router = new Router({
  prefix: '/v1/server',
});

/**
 * @swagger
 * /v1/server/statistic:
 *   get:
 *      consumes:
 *        - application/json
 *      description: Get server statistic
 *   responses:
 *     200:
 *       description: Server statistic
 *     400:
 *       description: Error with message
 *     401:
 *       description: Unautorized
 */
router.get(
  '/statistic',
  checkAccessToken,
  asyncMiddleware(ServerController.getStatistic)
);
