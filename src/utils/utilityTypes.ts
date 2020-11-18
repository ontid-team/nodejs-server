import { RouterContext } from 'koa-router';

interface RequestDefault<T> {
  request: { body: T };
}

export type Ctx<T = any, S = any> = RouterContext<S, RequestDefault<T>>;
