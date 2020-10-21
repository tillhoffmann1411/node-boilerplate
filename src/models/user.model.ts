import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

import { IUser } from '../interfaces/user.interface';
import { IRefreshToken } from '../interfaces/jwt';


const RefreshTokenSchema = new Schema({
  token: { type: String, required: true },
  createdByIp: { type: String, required: true },
  expires: { type: Number, required: true },
  created: { type: Number, required: true },
});


export interface IUserSchema extends Document, IUser {
  _id: string;
  refreshToken: IRefreshToken;
  comparePasswords: (password: string) => Promise<boolean>;
  generateHash: (password: string) => Promise<string>;
  isPasswordValid: (password: string) => Promise<boolean>;
}

const UserSchema = new Schema({
  email: {type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: { type: String, required: true },
  password: { type: String, required: true},
  refreshToken: { type: RefreshTokenSchema }
});


UserSchema.pre('save', async function(next) {
  const user = this as IUserSchema;
  if (!user.password || !user.isModified('password')) {
    return next();
  }
  if (user) {
    const hash = await user.generateHash(user.password);
    user.password = hash;
    return next(null);
  }
});

UserSchema.pre('updateOne', async function (next) {
  const user = this.getUpdate();
  if(user.password) {
    user.password = await bcrypt.hash(user.password, bcrypt.genSaltSync());
    this.update({}, user).exec()
  }
  next()
});

UserSchema.methods.comparePasswords = function(candidatePassword: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) =>{
    bcrypt.compare(candidatePassword, this.password)
      .then(isValid => resolve(isValid))
      .catch(error => reject(error));
  });
};

UserSchema.methods.generateHash = function(password: string): Promise<string> {
  return bcrypt.hash(password, bcrypt.genSaltSync());
};

UserSchema.methods.isPasswordValid = function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Omit the password when returning a user and change _id to id
UserSchema.set('toJSON', {
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.password;
    ret.id = ret._id;
    delete ret._id;
    delete ret.refreshToken;
    return ret;
  }
});

export default mongoose.model<IUserSchema>('User', UserSchema);