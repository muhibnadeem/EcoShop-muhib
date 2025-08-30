import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { hashPassword, comparePassword, signToken } from '../utils/auth.js';

const prisma = new PrismaClient();
const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) return res.status(409).json({ error: 'Email already registered' });
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: await hashPassword(data.password)
      },
      select: { id: true, name: true, email: true, role: true }
    });
    res.json({ user });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await comparePassword(data.password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!user.active) return res.status(403).json({ error: 'Account deactivated' });
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res
      .cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 7 * 24 * 3600 * 1000 })
      .json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token').json({ ok: true });
});

export default router;
