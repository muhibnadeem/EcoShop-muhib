import { Router } from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = Router();

router.post('/create-session', requireAuth, async (req, res) => {
  try {
    const { items } = req.body; // [{productId, quantity}]
    const products = await prisma.product.findMany({ where: { id: { in: items.map(i => i.productId) } } });
    const line_items = items.map(i => {
      const p = products.find(p => p.id === i.productId);
      return {
        price_data: {
          currency: 'usd',
          product_data: { name: p.name },
          unit_amount: Math.round(Number(p.price) * 100),
        },
        quantity: i.quantity
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout/cancel`
    });

    res.json({ id: session.id, url: session.url });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
