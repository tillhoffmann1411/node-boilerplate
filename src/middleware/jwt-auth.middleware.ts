import { Request, Response, NextFunction } from 'express';
import passportJwt from 'passport-jwt';
import passport from 'passport';

import User from '../models/user.model';
import { IJwtClaimSet } from '../interfaces/jwt';
import { IUser } from '../interfaces/user.interface';


export class JwtAuth {
  public static auth(req: Request, res: Response, next: NextFunction): void {
    if (!req.signedCookies['jwt']) {
      res.status(401).json({ code: 'jwt is missing' });
      return next('jwt is missing');
    }

    passport.authenticate('jwt', function (err, user, info) {
      if (err) {
        console.log('Passport Error: ' + JSON.stringify(err));
        res.clearCookie('jwt');
        res.status(401).json({ code: 'unauthorized' });
        return next(JSON.stringify(err));
      }
      if (!user) {
        if (info && info.message === 'jwt expired') {
          res.status(401).json({ code: 'jwt expired' });
        } else {
          res.status(401).json({ code: 'unauthorized' });
          return next(info);
        }
      } else {
        req.user = user;
        return next();
      }
    })(req, res, next);
  }

  /**
   * Gets executed after auth
   */
  public static async verify(payload: IJwtClaimSet, next: passportJwt.VerifiedCallback): Promise<void> {
    try {
      const user = await User.findOne({_id: payload._id});
      return user ? next(null, {  _id: user._id, name: user.name, email: user.email} as IUser) : next(null, false);
    } catch (err) {
      return next(err, false);
    }
  }
}
