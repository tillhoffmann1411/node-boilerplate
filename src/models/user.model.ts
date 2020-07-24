
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// TODO Refactore this to true salt
const SALT = 10;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;

  comparePasswords: (password: string, next: (Error, boolean?) => void) => void;
  generateHash: (password: string) => Promise<string>;
  isPasswordValid: (password: string) => Promise<boolean>;
}

const userSchema = new Schema({
  email: { type: String, required: true, index: { unique: true }},
  name: { type: String, required: true },
  password: { type: String, required: true}
});


userSchema.pre('save', function(next) {
  const user = this as IUser;
  if (user) {
    bcrypt.genSalt(SALT, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(error, hash) {
        if (error) {
          return next(error);
        }
        user.password = hash;
        return next(null);
      });
    });
  }
});

userSchema.methods.comparePasswords = function(candidatePassword: string, next: (Error, boolean?) => void) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) {
      next(err);
      return;
    }
    next(null, isMatch);
  });
};

userSchema.methods.generateHash = function(password: string) {
  return bcrypt.hash(password, bcrypt.genSaltSync(SALT));
};

userSchema.methods.isPasswordValid = function(password: string) {
  return bcrypt.compare(password, this.password);
};

// Omit the password when returning a user
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});

export default mongoose.model<IUser>('User', userSchema);