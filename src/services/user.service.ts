import { IUser } from '../interfaces/user.interface';
import User, { IUserDoc } from '../models/user.model';
import { TokenService } from './token.service';
import { JwtClaimSet, JwtTokenObject } from '../interfaces/jwt-token';

export class UserService {
  public static async signup(user: {name: string, email: string, password: string}): Promise<{user: IUser, tokenObject: JwtTokenObject}> {
    try {
      const createdUser = await User.create({
        name: user.name,
        email: user.email,
        password: user.password,
      });
      const tokenObject = await UserService.signin(user.email, user.password);
      return {user: createdUser, tokenObject};
    } catch (error) {
      throw new Error('Error by creating User:' + error.toString());
    }
  }

  public static async getById(id: string): Promise<IUserDoc> {
    return await User.findById(id);
  }

  public static async get(partUser: Partial<IUser>): Promise<IUserDoc> {
    return await User.findOne(partUser);
  }

  public static async update(user: Partial<IUserDoc>): Promise<{ok?: number, n?: number, deletedCount?: number}> {
    try {
      const response = await User.updateOne({ _id: user._id }, user);
      return response;
      
    } catch (error) {
      throw Error('Unexpected error during updating User');
    }
  }

  public static async delete(id: string): Promise<{ok?: number, n?: number, deletedCount?: number}> {
    try {
      const response = await User.deleteOne({}); // TODO remove this!!! Deletes all
      return response;
      
    } catch (error) {
      throw Error('Unexpected error during deleting User');
    }
  }

  public static async signin(email: string, password: string): Promise<JwtTokenObject> {
    try {
      const user = await UserService.get({ email: email });
      if (!user) {
        throw new Error('No User found with that email: ' + email);
      }
      const isValid = await user.isPasswordValid(password);
      if (isValid) {
        const claimSet: JwtClaimSet = {
          _id: user._id,
          name: user.name,
          email: user.email,
        }
        return TokenService.create(claimSet);
      } else {
        throw new Error('Wrong password');
      }
    } catch (error) {
      throw new Error(error);
    }

  }
}