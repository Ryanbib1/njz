/* 后端真实 Prisma Client */
import { PrismaClient } from '../prisma-generated/client';

const prisma = new PrismaClient();

export default prisma;
export { prisma };
