import { Router } from 'express';

import { Route } from '../interfaces/route.interface';
import { UserController } from '../controllers/user.controller';
import { JwtAuth } from '../middleware/jwt-auth.middleware';

export class UsersRoutes implements Route {
  router = Router();

  constructor(public path: string) {
    this.router.get(this.path + '/signout', JwtAuth.auth, UserController.signout);
    this.router.get(this.path + '/me', JwtAuth.auth, UserController.me);
    this.router.get(this.path + '/', JwtAuth.auth, UserController.index);
    this.router.post(this.path + '/signup', UserController.signup);
    this.router.post(this.path + '/signin', UserController.signin);
    this.router.patch(this.path + '/', JwtAuth.auth, UserController.update);
    this.router.delete(this.path + '/', JwtAuth.auth, UserController.delete);
  }
}
