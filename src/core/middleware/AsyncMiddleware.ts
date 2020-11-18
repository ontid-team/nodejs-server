import { Ctx } from '../../utils/utilityTypes';

export const asyncMiddleware = (handler: Function) => (ctx: Ctx, next) =>
  Promise.resolve(handler(ctx, next)).catch(err => {
    throw err;
  });
