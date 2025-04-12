// lib/auth.ts
import bcrypt from 'bcryptjs';
import dbConnect from '../db';
import User from '@/models/User';

export interface UserType {
  id: string;
  username: string;
  role: 'admin' | 'cashier';
}

export async function login(username: string, password: string): Promise<UserType | null> {
  await dbConnect();

  const user = await User.findOne({ username });
  if (!user) {
    return null;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return null;
  }

  return {
    id: user._id.toString(),
    username: user.username,
    role: user.role,
  };
}

export async function createUser(username: string, password: string, role: 'admin' | 'cashier') {
  await dbConnect();

  const hashedPassword = await bcrypt.hash(password, 10); // Hash password with salt rounds = 10
  const user = new User({
    username,
    password: hashedPassword,
    role,
  });

  await user.save();
  return user;
}