import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import orderHelpers from './routes/order-helpers.js';
import userRoutes from './routes/users.js';
import checkoutRoutes from './routes/checkout.js';
import stripeWebhook from './routes/stripe-webhook.js';

const app = express();
const prisma = new PrismaClient();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:4000';

app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderHelpers);
app.use('/api/users', userRoutes);
app.use('/api/checkout', checkoutRoutes);
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`EcoShop server running on :${port}`));
