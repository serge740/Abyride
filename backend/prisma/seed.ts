import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email    = 'admin@abyride.com';
  const password = 'Admin@123';

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    return;
  }

  const hashed = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.create({
    data: {
      names:    'Super Admin',
      email,
      password: hashed,
    },
  });

  console.log('✅ Admin seeded:');
  console.log(`   Email   : ${admin.email}`);
  console.log(`   Password: ${password}`);
  console.log(`   ID      : ${admin.id}`);
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
