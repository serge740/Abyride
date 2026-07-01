import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const FLEETS = [
  { slug: 'x',        name: 'Abyride X',                 description: 'Affordable everyday rides for up to 4 people',       category: 'STANDARD',   passengerCapacity: 4, perKmRate: 1.50, accessible: false },
  { slug: 'comforts', name: 'Comforts',                   description: 'New cars with extra legroom for up to 4 people',     category: 'PREMIUM',    passengerCapacity: 4, perKmRate: 2.00, accessible: false },
  { slug: 'xl',       name: 'AbyrideXL',                  description: 'Affordable rides for groups of up to 6 people',      category: 'GROUP',      passengerCapacity: 6, perKmRate: 2.75, accessible: false },
  { slug: 'van',      name: 'Wheelchair Accessible Van',  description: 'Specially equipped vehicles for wheelchair users',   category: 'ACCESSIBLE', passengerCapacity: 4, perKmRate: 1.75, accessible: true  },
] as const;

async function seedAdmin() {
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

async function seedFleets() {
  for (const fleet of FLEETS) {
    const existing = await prisma.fleet.findUnique({ where: { slug: fleet.slug } });
    if (existing) {
      console.log(`Fleet already exists: ${fleet.slug}`);
      continue;
    }
    const created = await prisma.fleet.create({ data: fleet as any });
    console.log(`✅ Fleet seeded: ${created.name} ($${created.perKmRate}/km)`);
  }
}

async function seedTestDriver() {
  const email    = 'driver@abyride.com';
  const password = 'Driver@123';

  const existing = await prisma.driver.findUnique({ where: { email } });
  if (existing) {
    console.log(`Test driver already exists: ${email}`);
    return;
  }

  // Attach to the first ACTIVE fleet if one exists
  const fleet = await prisma.fleet.findFirst({ where: { status: 'ACTIVE' } });

  const hashed = await bcrypt.hash(password, 10);
  const driver = await prisma.driver.create({
    data: {
      names:   'Test Driver',
      email,
      password: hashed,
      phone:   '+1 555 000 0001',
      status:  'ACTIVE',
      fleetId: fleet?.id ?? null,
    },
  });

  console.log('✅ Test driver seeded:');
  console.log(`   Email   : ${driver.email}`);
  console.log(`   Password: ${password}`);
  console.log(`   Fleet   : ${fleet?.name ?? 'none'}`);
  console.log(`   ID      : ${driver.id}`);
}

async function main() {
  await seedAdmin();
  await seedFleets();
  await seedTestDriver();
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
