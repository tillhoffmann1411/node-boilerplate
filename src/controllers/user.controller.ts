import { Request, Response } from 'express';
import User from '../models/user.model';
import { UserService } from '../services/user.service';
import { typeOfUser, IUser } from '../interfaces/user.interface';


export class UserController {
/**
   * Creates a new User
   * @param req Request param - the body should be empty
   * @param res Response param  - it returns all users
   */
  public static async index(req: Request, res: Response): Promise<void> {
    const user = await User.find();
    res.send(user);
    // TODO
  }

  /**
   * Returns a single User with given Id
   * @param req Request param - the body should contain the user _id
   * @param res Response param - it returns the user with the given _id
   */
  public static async me(req: Request, res: Response): Promise<void> {
    const id = req.user._id;
    if (id) {
      try {
        const result = await UserService.getById(id);
        res.send(result);
      } catch (error) {
        console.error('\x1b[31m', error);
        res.status(500).send('Error by getting User');
      }
    } else {
      console.error('\x1b[31m', 'Incorrect request body:', req.body);
      res.status(400).send('Body was incorrect');
    }
  }

  /**
   * Creates a new User
   * @param req Request param - the body should contain a name, email and password
   * @param res Response param - it returns the created user, the jwt token and the corresponding expiresIn value
   */
  public static async signup(req: Request, res: Response): Promise<void> {
    if (req.body.name && req.body.email && req.body.password) {
      try {
        const userAndTokensObject = await UserService.signup({
          name: req.body.name,
          email: req.body.email,
          password:req.body.password,
        }, req.ip);
        res.cookie('jwt', userAndTokensObject.jwt.token, {httpOnly: true, signed: true});               // TODO add in options 'secure: true' - missing for testing with postman
        res.status(200).send({
          loggedIn: true,
          user: userAndTokensObject.user,
          expires: userAndTokensObject.jwt.expires,
          refreshToken: userAndTokensObject.refreshToken.token,
          refreshTokenexpires: userAndTokensObject.refreshToken.expires,
        });
      } catch (err) {
        console.error('\x1b[31m', err);
        res.status(500).send({loggedIn: false, msg: 'Error by sign you up'});
      }
    } else {
      console.error('\x1b[31m', 'Incorrect request body:', req.body);
      res.status(400).send({loggedIn: false, msg: 'Body was incorrect'});
    }
  }

  /**
   * Signs an User in
   * @param req Request param - the body should contain the user email and password
   * @param res Response param - it returns the jwt token and the corresponding expiresIn value
   */
  public static async signin(req: Request, res: Response): Promise<void> {
    const email = req.body.email;
    const password = req.body.password;
    if (email && password) {
      try {
        const tokens = await UserService.signin(email, password, req.ip);
        const user = await UserService.get({email});
        res.cookie('jwt', tokens.jwt.token, {httpOnly: true, signed: true});              // TODO add in options 'secure: true' - missing for testing with postman
        res.status(200).send({
          loggedIn: true,
          user: user,
          expires: tokens.jwt.expires,
          refreshToken: tokens.refreshToken.token,
          refreshTokenexpires: tokens.refreshToken.expires,
        });
      } catch (error) {
        console.error('\x1b[31m', error);
        res.status(401).send({loggedIn:  false, msg: error});
      }
    } else {
      console.error('\x1b[31m', 'Incorrect request body:', req.body);
      res.status(400).send({loggedIn: false, msg: 'Body was incorrect'});
    }
  }

  /**
   * Logs an user out
   * @param req Request param - the body should be empty
   * @param res Response param - it returns true, when successfully loged out
   */
  public static signout(req: Request, res: Response): void {
    res.status(200).clearCookie('jwt').send({success: true});
  }

  /**
   * Updates an existing User
   * @param req Request param - the body should contain all values of an User
   * @param res Response param - it returns the updated user
   */
  public static async update(req: Request, res: Response): Promise<void> {
    const user: IUser = {
      _id: req.body._id,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };
    if (typeOfUser(user)) {
      try {
        const result = await UserService.update(user);
        res.status(200).send(result);
      } catch (error) {
        console.error('\x1b[31m', 'Error by updating User:', error)
        res.status(500).send('Error by updating User');
      }
    } else {
      console.error('\x1b[31m', 'Incorrect request body:', req.body);
      res.status(400).send('Body was incorrect');
    }
  }

  /**
   * Deletes an User
   * @param req Request param - the body should contain the user _id
   * @param res Response param - it returns the jwt token and the corresponding expiresIn value
   */
  public static async delete(req: Request, res: Response): Promise<void> {
    const id = req.body._id;
    if (id) {
      try {
        const deletedCount = await UserService.delete(id);
        if (deletedCount === 1) {
          res.clearCookie('jwt').send({success: true});
        } else {
          throw Error('No user deleted. Please check if the user id is correct.');
        }
      } catch (error) {
        console.error('\x1b[31m', 'Error by deleting User:', error);
        res.status(500).send({success: false, msg: error});
      }
    } else {
      console.error('\x1b[31m', 'Incorrect request body:', req.body);
      res.status(400).send({ success: false, msg: 'Body was incorrect'});
    }
  }
}