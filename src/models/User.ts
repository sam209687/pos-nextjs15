// models/User.ts
import mongoose, { Schema, model, Model } from 'mongoose';

interface IUser extends Document {
  username: string;
  password: string;
  role: 'admin' | 'cashier';
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'cashier'], required: true },
});

const User: Model<IUser> = mongoose.models.User || model<IUser>('User', UserSchema);

export default User;