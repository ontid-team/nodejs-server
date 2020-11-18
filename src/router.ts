import combineRouters from 'koa-combine-routers';
import { router as auth } from './modules/auth/auth.router';
import { router as shoot } from './modules/shoot/shoot.router';
import { router as stripe } from './modules/stripe/stripe.router';
import { router as tariff } from './modules/tariff/tariff.router';
import { router as promoCode } from './modules/promoCode/promoCode.router';
import { router as user } from './modules/user/user.router';
import { router as authCode } from './modules/authCode/authCode.router';
import { router as rating } from './modules/rating/rating.router';
import { router as server } from './modules/server/server.router';

export const router = combineRouters([
  auth,
  shoot,
  stripe,
  tariff,
  promoCode,
  user,
  authCode,
  rating,
  server,
]);
