# EcoShop – Next.js + Node/Express + Prisma (MySQL) + Stripe

A modern, production-ready e‑commerce starter. Frontend in **Next.js** (TailwindCSS), backend in **Node/Express**, database via **MySQL + Prisma**, and **Stripe** for secure payments.

## Features
- Customer
  - Browse products, categories, and product details
  - Cart with quantity updates and removal
  - Checkout with Stripe
  - Order confirmation & My Orders page
- Admin
  - Dashboard overview with stats
  - Manage products (CRUD + images), categories, orders, and users
  - Update order status
- Auth
  - Email/password auth using JWT (HTTP-only cookies)
  - Roles: `USER`, `ADMIN`
- Tech
  - Next.js App Router, TailwindCSS
  - Node/Express REST API
  - Prisma ORM (MySQL)
  - Stripe Checkout Session
  - Zod validation, bcrypt password hashing

## Quick Start

### 1) Prerequisites
- Node.js 18+
- MySQL 8+ (or a MySQL-compatible server)
- Stripe account + API keys

### 2) Configure environment
Copy each `.env.example` to `.env` and fill in values.

**server/.env**
```
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/ecoshop"
JWT_SECRET="change-this-super-secret"
STRIPE_SECRET_KEY="sk_live_or_test_here"
STRIPE_WEBHOOK_SECRET="whsec_..."
CLIENT_URL="http://localhost:3000"
PORT=4000
```

**web/.env.local**
```
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_or_test_here"
```

### 3) Install dependencies
In **server**:
```bash
cd server
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

In **web**:
```bash
cd web
npm install
npm run dev
```

### 4) Login as Admin
Seed creates an admin user:
- Email: admin@ecoshop.local
- Password: Admin@123

### 5) Stripe Webhook (optional but recommended)
Run your server publicly (e.g., `stripe listen --forward-to localhost:4000/webhooks/stripe`) and set `STRIPE_WEBHOOK_SECRET`.

## Notes
- This is a well-structured starter. You can expand models easily (variants, inventory, etc.).
- All API routes are namespaced under `/api` on the backend.
- Image uploads use simple URL fields; wire any storage provider (S3/Cloudinary) later.
