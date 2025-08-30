import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();

router.get('/me', requireAuth, async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(orders);
});

router.get('/', requireAuth, requireAdmin, async (_req, res) => {
  const orders = await prisma.order.findMany({ include: { user: true, items: { include: { product: true } } }, orderBy: { createdAt: 'desc' } });
  res.json(orders);
});

router.get('/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const order = await prisma.order.findUnique({ where: { id }, include: { items: { include: { product: true } }, user: true } });
  if (!order) return res.status(404).json({ error: 'Not found' });
  if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  res.json(order);
});

const statusSchema = z.object({ status: z.enum(['PENDING','PAID','SHIPPED','DELIVERED','CANCELLED']) });

router.patch('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const data = statusSchema.parse(req.body);
  const order = await prisma.order.update({ where: { id }, data: { status: data.status } });
  res.json(order);
});

export default router;
