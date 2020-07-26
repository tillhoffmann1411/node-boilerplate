import { Request, Response } from 'express';
import User from '../models/user.model';
import { UserService } from '../services/user.service';
import { typeOfUser } from '../interfaces/user.interface';


export class UserController {
/**
   * Creates a new User
   * @param req Request param
   * @param res Response param
   */
  public static async index(req: Request, res: Response): Promise<void> {
    console.log('Request GET /users');
    const user = await User.find();
    res.send(user);
    // TODO
  }

  /**
   * Creates a new User
   * @param req Request param
   * @param res Response param
   */
  public static async signup(req: Request, res: Response): Promise<void> {
    if (req.body.name && req.body.email && req.body.password) {
      try {
        const userAndToken = await UserService.signup({
          name: req.body.name,
          email: req.body.email,
          password:req.body.password,
        });
        res.send(userAndToken);
      } catch (err) {
        console.error('Error by creating User:', err);
        res.status(500).send('Error by creating User');
      }
    } else {
      console.log('Incorrect request body:', req.body);
      res.status(400).send('Body was incorrect');
    }
  }

  /**
   * Updates an existing User
   * @param req Request param
   * @param res Response param
   */
  public static async update(req: Request, res: Response): Promise<void> {
    const user = {
      _id: req.body._id,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };
    if (typeOfUser(user)) {
      try {
        const result = await UserService.update(user);
        res.send(result);
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
   * @param req Request param
   * @param res Response param
   */
  public static async delete(req: Request, res: Response): Promise<void> {
    const id = req.body._id;
    if (id) {
      try {
        const result = await UserService.delete(id);
        res.send(result);
      } catch (error) {
        res.status(500).send('Error by deleting User');
      }
    } else {
      console.log('Incorrect request body:', req.body);
      res.status(400).send('Body was incorrect');
    }
  }

  /**
   * Returns a single User with given Id
   * @param req Request param
   * @param res Response param
   */
  public static async get(req: Request, res: Response): Promise<void> {
    const id = req.body.id;
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
   * Signs an User in
   * @param req Request param
   * @param res Response param
   */
  public static async signin(req: Request, res: Response): Promise<void> {
    const email = req.body.email;
    const password = req.body.password;

    if (email && password) {
      try {
        const result = await UserService.signin(email, password);
        if (result.token && result.expiryDate) {
          res.send(result);
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Error by getting User');
      }
    } else {
      console.log('Incorrect request body:', req.body);
      res.status(400).send('Body was incorrect');
    }
  }
}