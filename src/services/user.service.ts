import { IUser } from '../interfaces/user.interface';
import User, { IUserDoc } from '../models/user.model';

export class UserService {
  public static async signup(user: {name: string, email: string, password: string}): Promise<{user: IUser, token: string, expiryDate: number}> {
    const createdUser = await User.create({
      name: user.name,
      email: user.email,
      password: user.password,
    });
    const token = await createdUser.generateAuthToken();
    const expiryDate = createdUser.generateExpiryDate(1);
    return {user: createdUser, token, expiryDate};
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

  public static async signin(email: string, password: string): Promise<{ 'token': string, 'expiryDate': number}> {
    try {
      const user = await UserService.get({ email: email });
      if (!user) {
        throw Error('No User found with that email: ' + email);
      }
      const expiryDate = user.generateExpiryDate(1);
      const token = await user.generateAuthToken();
      if (!token) {
        throw new Error('Could not generate Token');
      }
      if (await user.comparePasswords(password)) {
        return { 'token': token, 'expiryDate': expiryDate};
      } else {
        throw Error('Wrong password');
      }
    } catch (error) {
      throw Error(error);
    }

  }
}