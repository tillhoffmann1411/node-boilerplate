import passport from 'passport';
import express from 'express';
import passportJwt from 'passport-jwt';

import { JwtAuth } from '../middleware/jwt-auth.middleware';


export class Passport {
  private static options = {
    jwtFromRequest: Passport._cookieExtractor,
    secretOrKey: process.env.JWT_KEY,
  };

  public static init(): express.Handler {
    passport.use(new passportJwt.Strategy(Passport.options, JwtAuth.verify));
    return passport.initialize();
  }

  private static _cookieExtractor(req) {
    if (req && req.signedCookies) {
      return req.signedCookies['jwt'];
    } else {
      return null;
    }
  }
}
