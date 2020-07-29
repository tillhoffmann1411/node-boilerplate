import passport from 'passport';
import express from 'express';

import { AuthMiddleware } from '../middleware/auth-middleware.middleware';


export class Passport {
  public static init(): express.Handler {
    passport.use(AuthMiddleware.JwtAuthenticate());
    return passport.initialize();
  }
}
