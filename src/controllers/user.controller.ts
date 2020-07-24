import { Request, Response } from 'express';
import User from '../models/user.model';


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
  public static async create(req: Request, res: Response): Promise<void> {
    console.log('Request POST /users');
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    res.send(user);
  }

  /**
   * Updates an existing User
   * @param req Request param
   * @param res Response param
   */
  public static update(req: Request, res: Response): void {
    console.log('Request patch /users');
    // TODO
  }

  /**
   * Deletes an User
   * @param req Request param
   * @param res Response param
   */
  public static async delete(req: Request, res: Response): Promise<void> {
    console.log('Request delete /users');
    const result = await User.remove({'name': 'Till'});
    res.send(result);
    // TODO
  }

  /**
   * Returns a single User with given Id
   * @param req Request param
   * @param res Response param
   */
  public static get(req: Request, res: Response): void {
    console.log('Request get /users/id');
    // TODO
  }

  /**
   * Signs an User in
   * @param req Request param
   * @param res Response param
   */
  public static signin(req: Request, res: Response): void {
    console.log('Request POST /users/signnin');
    User.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
        throw err;
      }
  
      // test a matching password
      user.comparePasswords(req.body.password, (err, isMatch) => {
        if (err) {
          throw err;
        }
        res.send(isMatch);
      });
    });
  }
  
  /**
   * Signs an User up
   * @param req Request param
   * @param res Response param
   */
  public static signup(req: Request, res: Response): void {
    // TODO
  }
}