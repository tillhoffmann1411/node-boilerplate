
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

import { IUser } from '../interfaces/user.interface';

// TODO Refactore this to true salt
const COST = 10;

export interface IUserDoc extends Document, IUser {
  _id: string;
  comparePasswords: (password: string) => Promise<boolean>;
  generateHash: (password: string) => Promise<string>;
  isPasswordValid: (password: string) => Promise<boolean>;
}

const userSchema = new Schema({
  email: {type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: { type: String, required: true },
  password: { type: String, required: true},
});


userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const user = this as IUserDoc;
  if (user) {
    const hash = await user.generateHash(user.password);
    user.password = hash;
    return next(null);
  }
});

userSchema.methods.comparePasswords = function(candidatePassword: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) =>{
    bcrypt.compare(candidatePassword, this.password)
      .then(isValid => resolve(isValid))
      .catch(error => reject(error));
  });
};

userSchema.methods.generateHash = function(password: string): Promise<string> {
  return bcrypt.hash(password, bcrypt.genSaltSync(COST));
};

userSchema.methods.isPasswordValid = function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Omit the password when returning a user and change _id to id
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model<IUserDoc>('User', userSchema);