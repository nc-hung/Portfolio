import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'
import path from 'path';

const globalForPrisma = globalThis as unknown as { prisma_v7_6: PrismaClient }

const dbPath = path.join(process.cwd(), 'dev.db');
const adapter = new PrismaBetterSqlite3({ 
  url: `file:${dbPath}` 
})

console.log("[Prisma] Initializing with Profile support...");
export const prisma = globalForPrisma.prisma_v7_6 || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma_v7_6 = prisma
