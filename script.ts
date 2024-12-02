import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Example query with all required fields
  const user = await prisma.user.findMany()

  console.log(user);
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });