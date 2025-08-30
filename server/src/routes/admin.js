import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();

router.get('/stats', requireAuth, requireAdmin, async (_req, res) => {
  const [products, orders, users] = await Promise.all([
    prisma.product.count(),
    prisma.order.findMany(),
    prisma.user.count()
  ]);
  const revenue = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((s, o) => s + Number(o.total), 0);
  res.json({ products, orders: orders.length, revenue, users });
});

export default router;
