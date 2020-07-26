import { Router } from 'express';

import { Route } from '../interfaces/route.interface';
import { UserController } from '../controllers/user.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

export class UsersRoutes implements Route {
  router = Router();

  constructor(public path: string) {
    this.router.get(this.path + '/', UserController.index);
    this.router.patch(this.path + '/', [AuthMiddleware.auth], UserController.update);
    this.router.delete(this.path + '/', UserController.delete);
    this.router.get(this.path + '/:id', [AuthMiddleware.auth], UserController.get);
    this.router.post(this.path + '/signin', UserController.signin);
    this.router.post(this.path + '/signup', UserController.signup);
  }
}
