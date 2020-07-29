import passportJwt, { ExtractJwt } from 'passport-jwt';

import User from '../models/user.model';
import { JwtClaimSet } from '../interfaces/jwt-token';
import { IUser } from '../interfaces/user.interface';

export class AuthMiddleware {
  private static options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_KEY,
  };

  public static JwtAuthenticate(): passportJwt.Strategy {
    // The JWT payload is passed into the verify callback
    return new passportJwt.Strategy(AuthMiddleware.options, async (payload: JwtClaimSet, next) => {
      try {
        const user = await User.findOne({_id: payload._id});
        return user ? next(null, { _id: user._id, email: user.email, name: user.name, } as IUser) : next(null, false);
      } catch (err) {
        return next(err, false);
      }
    });

  }
}
