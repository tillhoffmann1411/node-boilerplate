
import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
  name: string;
  eMail: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  eMail: { type: String, required: true },
  password: { type: String, required: true}
});

const User = mongoose.model<User>('User', UserSchema);
export default User;