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
        console.error(error);
        res.status(500).send('Error by getting User');
      }
    } else {
      console.log('Incorrect request body:', req.body);
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
        const userAndTokenObject = await UserService.signup({
          name: req.body.name,
          email: req.body.email,
          password:req.body.password,
        });
        res.cookie('jwt-token', userAndTokenObject.tokenObject.token, {httpOnly: true, secure: true, signed: true});
        res.status(200).send({
          'success': true,
          'user': userAndTokenObject.user,
          'token': userAndTokenObject.tokenObject.token,
          'expiresIn': userAndTokenObject.tokenObject.expiresIn
        });
      } catch (err) {
        console.error(err);
        res.status(500).send({'success': false, 'msg': 'Error by sign you up'});
      }
    } else {
      console.log('Incorrect request body:', req.body);
      res.status(400).send({'success': false, 'msg': 'Body was incorrect'});
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
        const tokenObject = await UserService.signin(email, password);
        res.cookie('jwt-token', tokenObject.token, {httpOnly: true, signed: true});
        res.status(200).send({'success': true, 'token': tokenObject.token, 'expiresIn': tokenObject.expiresIn});
      } catch (error) {
        console.error(error);
        res.status(401).send({'success':  false, 'msg': error});
      }
    } else {
      console.log('Incorrect request body:', req.body);
      res.status(400).send({'success': false, 'msg': 'Body was incorrect'});
    }
  }

  /**
   * Logs an user out
   * @param req Request param - the body should be empty
   * @param res Response param - it returns true, when successfully loged out
   */
  public static signout(req: Request, res: Response): void {
    res.status(200).clearCookie('jwt-token').send({'success': true});
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
        res.status(500).send('Error by updating User');
      }
    } else {
      console.log('Incorrect request body:', req.body);
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
          res.clearCookie('jwt-token').send({'success': true});
        } else {
          throw Error();
        }
      } catch (error) {
        res.status(500).send({'success': false, 'msg': 'Error by deleting User'});
      }
    } else {
      console.log('Incorrect request body:', req.body);
      res.status(400).send({ 'success': false, 'msg': 'Body was incorrect'});
    }
  }
}