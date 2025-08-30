import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // categories
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    create: { name: 'Electronics', slug: 'electronics' },
    update: {}
  });
  const clothing = await prisma.category.upsert({
    where: { slug: 'clothing' },
    create: { name: 'Clothing', slug: 'clothing' },
    update: {}
  });
  const accessories = await prisma.category.upsert({
    where: { slug: 'accessories' },
    create: { name: 'Accessories', slug: 'accessories' },
    update: {}
  });

  // products
  await prisma.product.createMany({
    data: [
      { name: 'Wireless Headphones', description: 'Noise cancelling over-ear.', price: 149.99, imageUrl: 'https://picsum.photos/seed/wh/600/400', categoryId: electronics.id },
      { name: 'Smart Watch', description: 'Fitness + notifications.', price: 199.00, imageUrl: 'https://picsum.photos/seed/sw/600/400', categoryId: electronics.id },
      { name: 'Hoodie', description: 'Cozy and warm.', price: 49.99, imageUrl: 'https://picsum.photos/seed/hoodie/600/400', categoryId: clothing.id },
      { name: 'Sunglasses', description: 'UV protection.', price: 29.99, imageUrl: 'https://picsum.photos/seed/sg/600/400', categoryId: accessories.id }
    ],
    skipDuplicates: true
  });

  // admin
  const password = await bcrypt.hash('Admin@123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@ecoshop.local' },
    update: {},
    create: { name: 'Admin', email: 'admin@ecoshop.local', password, role: 'ADMIN' }
  });

  console.log('Seed complete');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
