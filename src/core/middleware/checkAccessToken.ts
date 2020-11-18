import jwt from 'jsonwebtoken';
import { RouterContext } from 'koa-router';
import { jwtConfig } from '../../config/JWTConfig';
import { UserFromToken } from '../../modules/auth/auth.type';

export async function checkAccessToken(ctx: RouterContext, next: Function) {
  try {
    const userFromToken = jwt.verify(
      ctx.cookies.get(jwtConfig.tokenName),
      jwtConfig.jwtSecret
    ) as UserFromToken;

    ctx.assert(
      userFromToken.userId && userFromToken.role,
      401,
      'Token is invalid'
    );

    Object.defineProperty(ctx.state, 'userFromToken', {
      enumerable: true,
      get() {
        return userFromToken;
      },
      set() {
        throw new TypeError('This property is unwritable');
      },
    });
  } catch (err) {
    ctx.throw(401, err);
  }

  await next();
}
