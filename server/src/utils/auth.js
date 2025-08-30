import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const hashPassword = async (password) => bcrypt.hash(password, 10);
export const comparePassword = async (password, hash) => bcrypt.compare(password, hash);

export const signToken = (payload) => {
  const secret = process.env.JWT_SECRET;
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;
  return jwt.verify(token, secret);
};
