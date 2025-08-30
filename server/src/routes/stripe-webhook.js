import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function stripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // In production, attach metadata (like userId, items) to session when creating it.
    // For this starter, we can't fetch items from Stripe, so mark payment success only.
    await prisma.order.updateMany({
      where: { paymentId: session.id },
      data: { status: 'PAID', paymentStatus: 'paid' }
    });
  }
  res.json({ received: true });
}
