import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid';


import { IJwtClaimSet, IJwtTokenObject, IRefreshToken } from '../interfaces/jwt';
import { JWT_CONFIG } from '../config/jwt.config';
import User, { IUserSchema } from '../models/user.model';


export class TokenService {
  public static create(claimSet: IJwtClaimSet): IJwtTokenObject {
    const token = jwt.sign(claimSet, process.env.JWT_KEY, {expiresIn: JWT_CONFIG.expiresIn});
    return {
      token: token,
      expires: JWT_CONFIG.expiresIn
    };
  }

  public static decode(encodedToken: string): IJwtClaimSet {
    const token = jwt.decode(encodedToken) as IJwtClaimSet;
    return token;
  }

  public static async getUserFromJwt(jwt: string): Promise<IUserSchema> {
    const decodedJwt = TokenService.decode(jwt);
    const user = await User.findById(decodedJwt._id);
    if (user) {
      return user;
    } else {
      throw new Error('User from jwt is not in the database, id: ' + decodedJwt._id);
    }
  }


  /**
   * Refresh token methods
   */

  public static validateRefreshToken(token: string, user: IUserSchema, ip: string): { valid: boolean, msg: string} {
    const refreshToken = user.refreshToken;
    if (refreshToken && refreshToken.token === token && refreshToken.createdByIp === ip && Date.now() <= refreshToken.expires) {
      return { valid: true, msg: ''};

    } else if (!refreshToken) {
      return { valid: false, msg: 'No Refresh Token found.'};

    } else if (refreshToken.token !== token) {
      return { valid: false, msg: 'Refresh Token does not correspond to the client token.'};

    } else if (refreshToken.createdByIp !== ip) {
      return { valid: false, msg: 'Refresh Token is from different IP.'};

    } else if (Date.now() >= refreshToken.expires) {
      return { valid: false, msg: 'Refresh Token is expired.'};

    }
    return { valid: false, msg: 'Refresh Token is not valid.'};
  }

  public static async createRefreshTokenAndAddToUser(userSchema: IUserSchema, ip: string): Promise<IRefreshToken> {
    const refreshToken: IRefreshToken = {
      token: uuid(),
      createdByIp: ip,
      created: Date.now(),
      expires: Date.now() + 1000 * JWT_CONFIG.refreshTokenexpiresIn,
    };
    await User.updateOne({ _id: userSchema._id }, { $set: { refreshToken: refreshToken } }, (err) => {
      if (err) {
        throw new Error('Error by adding refresh token to user. ' + err);
      }
    });
    return refreshToken;
  }
}
