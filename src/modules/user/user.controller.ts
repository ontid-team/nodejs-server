import { Controller } from '../../core/lib/BaseController';
import { Ctx } from '../../utils/utilityTypes';
import { UserService } from './user.service';
import { ObjectId } from 'mongodb';

export class UserController extends Controller {
  static async getUsers(ctx: Ctx) {
    const result = await UserService.getUsersByQuery(ctx.query, {
      projection: {
        password: 0,
      },
    });
    ctx.body = result;
  }

  static async deleteUsers(ctx: Ctx) {
    const result = await UserService.deleteUsersById(ctx.request.body.ids);

    ctx.body = result;
  }

  static async banUsers(ctx: Ctx) {
    const result = await UserService.banUsersById(
      ctx.request.body.users.map(user => ({
        ...user,
        _id: new ObjectId(user._id),
      }))
    );

    ctx.body = result;
  }

  static async getUserById(ctx: Ctx) {
    const result = await UserService.getUserById(
      { _id: ctx.params.userId },
      {
        password: 0,
      }
    );

    ctx.body = result;
  }
}
