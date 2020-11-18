import { Ctx } from '../../utils/utilityTypes';

export const checkDate = (fields: string[]) => async (
  ctx: Ctx,
  next: Function
) => {
  const curDate = new Date();
  ctx.assert(
    fields.every(
      field =>
        !ctx.request.body[field] || new Date(ctx.request.body[field]) >= curDate
    ),
    400,
    'Past date'
  );

  await next();
};
