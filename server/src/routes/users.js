import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();

router.get('/', requireAuth, requireAdmin, async (_req, res) => {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, active: true, createdAt: true } });
  res.json(users);
});

router.get('/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, role: true, active: true, createdAt: true, orders: true } });
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

router.patch('/:id/deactivate', requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.update({ where: { id }, data: { active: false } });
  res.json(user);
});

export default router;
