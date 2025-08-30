import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (_req, res) => {
  const categories = await prisma.category.findMany({ include: { products: true } });
  res.json(categories);
});

router.get('/:slug', async (req, res) => {
  const slug = req.params.slug;
  const category = await prisma.category.findUnique({ where: { slug }, include: { products: true } });
  if (!category) return res.status(404).json({ error: 'Not found' });
  res.json(category);
});

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2)
});

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const data = categorySchema.parse(req.body);
    const category = await prisma.category.create({ data });
    res.json(category);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = categorySchema.partial().parse(req.body);
    const category = await prisma.category.update({ where: { id }, data });
    res.json(category);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  await prisma.category.delete({ where: { id } });
  res.json({ ok: true });
});

export default router;
