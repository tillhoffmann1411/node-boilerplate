import { Request, Response, NextFunction } from 'express';
import passportJwt from 'passport-jwt';
import passport from 'passport';

import User from '../models/user.model';
import { JwtClaimSet } from '../interfaces/jwt-token';
import { IUser } from '../interfaces/user.interface';


export class JwtAuth {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static auth(req: Request, res: Response, next: NextFunction): any {
    if (!req.signedCookies['jwt-token']) {
      console.log('jwt token is missing');
      res.status(401).json({ code: 'cookie is missing' });
      return next('jwt token is missing');
    }

    passport.authenticate('jwt', function (err, user, info) {
      if (err) {
        console.log('Passport Error: ' + JSON.stringify(err));
        res.clearCookie('jwt-token');
        res.status(401).json({ code: 'unauthorized' });
        return next(JSON.stringify(err));
      }
      // Either wrong user information or token expired
      if (!user) {
        console.log(info);
        if (info && info.message === 'jwt expired') {
          console.log('token expired!');
          res.clearCookie('jwt-token');
          res.status(401).json({ code: 'unauthorized', status: 'token expired!' });
          // Refresh token logic
          //   const expiredJWT = jwt.decode(req.signedCookies['jwt-token']) as JwtClaimSet;

        //   User.findById(expiredJWT._id, async function (err, user) {
        //     if (err) {
        //       res.status(500).json({ code: 'database access error' });
        //       return next(JSON.stringify(err));
        //     }
        //     if (user) {
        //       const refreshTokenValidation = await TokenService.validateRefreshToken(req.signedCookies.REFRESH_TOKEN, user, req);
        //       if (refreshTokenValidation.valid) {
        //         const authToken = TokenService.createAuthToken(user);
        //         const refreshToken = await TokenService.createRefreshTokenAndAddToUser(user, req);
        //         res.cookie('jwt-token', authToken, { httpOnly: true, secure: true, signed: true });
        //         res.cookie('refresh-token', refreshToken, { httpOnly: true, secure: true, signed: true });
        //         req.user = user;
        //         return next();
        //       } else {
        //         console.log(refreshTokenValidation.err);
        //         res.status(401).json({ code: refreshTokenValidation.err });
        //         return next(JSON.stringify(refreshTokenValidation.err));
        //       }
        //     } else {
        //       console.log('User id from cookie exists not in database');
        //       res.status(401).json({ code: 'unauthorized' });
        //       return next('User id from cookie exists not in database');
        //     }
        //   });
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static async verify(payload: JwtClaimSet, next: passportJwt.VerifiedCallback): Promise<any> {
    try {
      const user = await User.findOne({_id: payload._id});
      return user ? next(null, {  _id: user._id, name: user.name, email: user.email} as IUser) : next(null, false);
    } catch (err) {
      return next(err, false);
    }
  }
}
