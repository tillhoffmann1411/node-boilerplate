import jwt from 'jsonwebtoken'

import { JwtClaimSet, JwtTokenObject } from '../interfaces/jwt-token';
import { JWT_CONFIG } from '../config/jwt.config';


export class TokenService {
  public static create(claimSet: JwtClaimSet): JwtTokenObject {
    const token = jwt.sign(claimSet, process.env.JWT_KEY, {expiresIn: JWT_CONFIG.expiresIn});
    return {
      token: token,
      expiresIn: JWT_CONFIG.expiresIn
    };
  }
}