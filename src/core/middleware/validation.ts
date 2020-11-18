import { Ctx } from '../../utils/utilityTypes';
import { IJsonSchemas, validate } from '../../utils/jsonSchemaValidation';

export const validation = (schemas: IJsonSchemas) => async (
  ctx: Ctx,
  next: Function
) => {
  validate(schemas.params, ctx.params);
  validate(schemas.query, ctx.query);
  validate(schemas.body, ctx.request.body);

  await next();
};
