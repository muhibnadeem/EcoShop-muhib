import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (_req, res) => {
  const products = await prisma.product.findMany({ include: { category: true } });
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(2),
  price: z.number().positive(),
  imageUrl: z.string().url(),
  categoryId: z.number().int()
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const data = productSchema.parse(req.body);
    const product = await prisma.product.create({ data });
    res.json(product);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = productSchema.partial().parse(req.body);
    const product = await prisma.product.update({ where: { id }, data });
    res.json(product);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  await prisma.orderItem.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });
  res.json({ ok: true });
});

export default router;
