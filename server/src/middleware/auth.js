import { verifyToken } from '../utils/auth.js';

export const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
  next();
};
