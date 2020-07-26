
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

import { IUser } from '../interfaces/user.interface';

// TODO Refactore this to true salt
const COST = 10;

export interface IUserDoc extends Document, IUser {
  tokens: {token: string, expiryDate: number}[];

  comparePasswords: (password: string) => Promise<boolean>;
  generateHash: (password: string) => Promise<string>;
  isPasswordValid: (password: string) => Promise<boolean>;
  generateAuthToken: () => Promise<string>;
  generateExpiryDate: (h: number) => number;
}

const userSchema = new Schema({
  email: {type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: { type: String, required: true },
  password: { type: String, required: true},
  tokens: [{
    token: { type: String, required: true },
    expiryDate: { type: Number, required: true},
  }]
});


userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const user = this as IUserDoc;
  if (user) {
    console.log('Pre hash password:', user.password);
    const hash = await user.generateHash(user.password);
    console.log('After hash password:', hash);
    user.password = hash;
    return next(null);
  }
});

userSchema.methods.comparePasswords = function(candidatePassword: string): Promise<boolean> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise<boolean>(async (resolve, reject) =>{
    console.log('Candidate Password:', candidatePassword);
    console.log('User.password:', this.password);
    console.log('Generated Candidate Hash:', await this.generateHash(candidatePassword));
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(isMatch);
    });
  });
};

userSchema.methods.generateHash = function(password: string): Promise<string> {
  return bcrypt.hash(password, bcrypt.genSaltSync(COST));
};

userSchema.methods.isPasswordValid = function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAuthToken = async function(): Promise<string> {
  // Generate an auth token for the user
  const user = this as IUserDoc;
  const expiryDate = this.generateExpiryDate(1);
  const token = jwt.sign({_id: user._id}, process.env.JWT_KEY);
  user.tokens = user.tokens.concat({token, expiryDate});
  await user.save();
  return token;
}

userSchema.methods.generateExpiryDate = function(h: number): number {
  return new Date().setTime(new Date().getTime() + (h*60*60*1000));
}

// Omit the password when returning a user
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});

export default mongoose.model<IUserDoc>('User', userSchema);