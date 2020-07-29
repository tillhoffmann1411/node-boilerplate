import { Router } from 'express';

import { Route } from '../interfaces/route.interface';
import { UserController } from '../controllers/user.controller';
import passport from 'passport';

export class UsersRoutes implements Route {
  router = Router();

  constructor(public path: string) {
    this.router.get(this.path + '/', passport.authenticate('jwt', { session: false }), UserController.index);
    this.router.patch(this.path + '/', passport.authenticate('jwt', { session: false }), UserController.update);
    this.router.delete(this.path + '/', UserController.delete);
    this.router.get(this.path + '/:id', passport.authenticate('jwt', { session: false }), UserController.get);
    this.router.post(this.path + '/signin', UserController.signin);
    this.router.post(this.path + '/signup', UserController.signup);
  }
}
