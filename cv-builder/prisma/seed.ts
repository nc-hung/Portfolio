import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import { masterCVBlocks } from '../src/data/master-cv';

const adapter = new PrismaBetterSqlite3({ 
  url: 'file:./dev.db' 
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding Master CV Blocks...');
  
  for (const block of masterCVBlocks) {
    await prisma.masterCVBlock.create({
      data: {
        category: block.category,
        variant: block.variant,
        content: typeof block.content === 'string' ? block.content : JSON.stringify(block.content),
        keywords: Array.isArray(block.keywords) ? block.keywords.join(', ') : block.keywords,
        language: block.language || 'VI'
      }
    });
  }
  
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
