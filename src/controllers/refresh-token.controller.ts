import { Request, Response } from 'express';
import { TokenService } from '../services/token.service';

export class RefreshTokenController {

  public static async refresh(req: Request, res: Response): Promise<void> {
    const jwt = req.signedCookies['jwt'];
    const refreshToken = req.body.refreshToken;
    if (!jwt) {
      res.status(401).send({ code: 'jwt is missing' });
    }
    if (!refreshToken) {
      res.status(400).send({ code: 'Refresh token is missing' });
    }
    try {
      const user = await TokenService.getUserFromJwt(jwt);
      const isRefreshTokenValid = TokenService.validateRefreshToken(refreshToken, user, req.ip);
      if (isRefreshTokenValid.valid) {
        console.log('Found valid refresh token');
        const authToken = TokenService.create({ _id: user._id, name: user.name, email: user.email });
        res.cookie('jwt', authToken.token, { httpOnly: true, signed: true });          // TODO add in options 'secure: true' - missing for testing with postman
        res.send({ success: true, expiresIn: authToken.expires });
      } else {
        const error = isRefreshTokenValid.msg;
        console.error('\x1b[31m', error);
        res.status(401).send({ success: false, code: error });
      }
      
    } catch (error) {
      console.error('\x1b[31m', error);
      res.status(500).send({success: false, msg: 'Error by creating new jwt'});
    }
  }

}