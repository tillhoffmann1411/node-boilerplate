import { Router } from 'express';

import { Route } from '../interfaces/route.interface';
import { RefreshTokenController } from '../controllers/refresh-token.controller';

export class RefreshTokenRoutes implements Route {
  router = Router();

  constructor(public path: string) {
    this.router.post(this.path + '/', RefreshTokenController.refresh);
  }
}
