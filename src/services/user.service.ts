import { IUser } from '../interfaces/user.interface';
import User, { IUserSchema } from '../models/user.model';
import { TokenService } from './token.service';
import { IJwtClaimSet, IJwtTokenObject, IRefreshToken } from '../interfaces/jwt';

export class UserService {
  public static async signup(user: {name: string, email: string, password: string}, clientIp: string): Promise<{user: IUser, jwt: IJwtTokenObject, refreshToken: IRefreshToken}> {
    const createdUser = await User.create({
      name: user.name,
      email: user.email,
      password: user.password,
    });
    const tokens = await UserService.signin(user.email, user.password, clientIp);
    return {user: createdUser, ...tokens};
  }

  public static async getById(id: string): Promise<IUserSchema> {
    return await User.findById(id);
  }

  public static async get(partUser: Partial<IUser>): Promise<IUserSchema> {
    return await User.findOne(partUser);
  }

  public static async update(user: Partial<IUserSchema>): Promise<{ modified: number }> {
    const response = await User.updateOne({ _id: user._id }, user);
    return { modified: response.nModified };
  }

  public static async delete(id: string): Promise<number> {
    try {
      const response = await User.deleteOne({ _id: id });
      return response.deletedCount;
      
    } catch (error) {
      throw Error('Unexpected error during deleting User');
    }
  }

  public static async signin(email: string, password: string, clientIp: string): Promise<{ jwt: IJwtTokenObject, refreshToken: IRefreshToken }> {
    try {
      const user = await UserService.get({ email: email });
      if (!user) {
        throw new Error('No User found with that email: ' + email);
      }
      const isValid = await user.isPasswordValid(password);
      if (isValid) {
        const claimSet: IJwtClaimSet = {
          _id: user._id,
          name: user.name,
          email: user.email,
        }
        const refreshToken = await TokenService.createRefreshTokenAndAddToUser(user, clientIp);
        const jwt = TokenService.create(claimSet);
        return { jwt, refreshToken };
      } else {
        throw new Error('Wrong password');
      }
    } catch (error) {
      throw new Error(error);
    }

  }
}