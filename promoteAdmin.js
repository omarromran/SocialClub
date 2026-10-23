require('dotenv').config();
const prisma = require('../config/prisma');

async function promote() {
  const username = process.argv[2]?.trim().toLowerCase();
  if (!username) {
    console.error('Usage: node backend/scripts/promoteAdmin.js <username>');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    console.error(`No user named "${username}".`);
    process.exit(1);
  }

  await prisma.user.update({ where: { id: user.id }, data: { isAdmin: true } });
  await prisma.admin.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });

  console.log(`Promoted @${username} to admin.`);
  await prisma.$disconnect();
}

promote().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
