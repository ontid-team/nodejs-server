import Router from 'koa-router';
import { asyncMiddleware } from '../../core/middleware/AsyncMiddleware';
import { UserController } from './user.controller';
import { checkAccessToken } from '../../core/middleware/checkAccessToken';
import { validation } from '../../core/middleware/validation';
import {
  getUsersSchema,
  deleteUsersSchema,
  banUsersSchema,
  getUserSchema,
} from './user.schema';
import { mutateNumberFields } from '../../core/middleware/mutateNumberFields';
import { mutateObjectIdsFields } from '../../core/middleware/mutateObjectIdsFields';
import { mutateObjectIdFields } from '../../core/middleware/mutateObjectIdFields';

export const router = new Router({
  prefix: '/v1/user',
});

/**
 * @swagger
 * /v1/user:
 *   get:
 *   responses:
 *     200:
 *       description: Users
 *     400:
 *       description: Error with message
 *     401:
 *       description: Unautorized
 *
 */
router.get(
  '/',
  checkAccessToken,
  validation(getUsersSchema),
  mutateNumberFields(['skip', 'limit']),
  asyncMiddleware(UserController.getUsers)
);

/**
 * @swagger
 * /v1/user/delete:
 *   post:
 *   responses:
 *     200:
 *       description: Users deleted
 *     400:
 *       description: Error with message
 *     401:
 *       description: Unautorized
 *
 */
router.post(
  '/delete',
  checkAccessToken,
  validation(deleteUsersSchema),
  mutateObjectIdsFields(['request.body.ids']),
  asyncMiddleware(UserController.deleteUsers)
);

/**
 * @swagger
 * /v1/user/ban:
 *   put:
 *   responses:
 *     200:
 *       description: Users banned
 *     400:
 *       description: Error with message
 *     401:
 *       description: Unautorized
 *
 */
router.put(
  '/ban',
  checkAccessToken,
  validation(banUsersSchema),
  asyncMiddleware(UserController.banUsers)
);

/**
 * @swagger
 * /v1/user/{userId}:
 *   get:
 *   responses:
 *     200:
 *       description: User by id
 *     400:
 *       description: Error with message
 *     401:
 *       description: Unautorized
 *
 */
router.get(
  '/:userId',
  checkAccessToken,
  validation(getUserSchema),
  mutateObjectIdFields(['params.userId']),
  asyncMiddleware(UserController.getUserById)
);
