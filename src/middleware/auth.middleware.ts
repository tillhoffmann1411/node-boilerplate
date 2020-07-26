import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken'
import User from '../models/user.model';

export class AuthMiddleware {
  public static async auth(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.header('Authorization')) {
      res.status(401).send({ error: 'No Authorization data found'});
    }
    const token = req.header('Authorization').replace('Bearer ', '');
    const data = jwt.verify(token, process.env.JWT_KEY)
    try {
      const user = await User.findOne({ _id: data._id, 'tokens.token': token })
      if (!user) {
        throw new Error()
      }
      res.locals.user = user
      res.locals.token = token
      next()
    } catch (error) {
      res.status(401).send({ error: 'Not authorized to access this resource' })
    }
  
  }
}
