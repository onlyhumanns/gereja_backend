// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Seed admin user
  const existing = await prisma.user.findUnique({ where: { email: 'admin@gereja.com' } });
  if (!existing) {
    const hashed = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        nama: 'Administrator',
        email: 'admin@gereja.com',
        password: hashed,
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin user created: admin@gereja.com / admin123');
  } else {
    console.log('ℹ️  Admin user already exists.');
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
