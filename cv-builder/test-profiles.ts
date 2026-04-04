import { prisma } from './src/lib/db';

async function test() {
  try {
    console.log("Checking Profile model...");
    const profiles = await prisma.profile.findMany();
    console.log("Profiles found:", profiles);
  } catch (e: any) {
    console.error("Prisma Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
