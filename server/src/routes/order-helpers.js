import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();

// Prepare an order locally before Stripe redirect
router.post('/prepare', requireAuth, async (req, res) => {
  const { items } = req.body; // [{productId, quantity}]
  const products = await prisma.product.findMany({ where: { id: { in: items.map(i => i.productId) } } });
  let total = 0;
  const orderItemsData = items.map(i => {
    const p = products.find(p => p.id === i.productId);
    const price = Number(p.price);
    total += price * i.quantity;
    return { productId: p.id, quantity: i.quantity, price };
  });
  const order = await prisma.order.create({
    data: {
      userId: req.user.id,
      total,
      items: { create: orderItemsData },
      status: 'PENDING'
    }
  });
  res.json({ orderId: order.id });
});

router.post('/attach-session', requireAuth, async (req, res) => {
  const { orderId, sessionId } = req.body;
  await prisma.order.update({ where: { id: orderId }, data: { paymentId: sessionId, paymentStatus: 'initiated' } });
  res.json({ ok: true });
});

export default router;
