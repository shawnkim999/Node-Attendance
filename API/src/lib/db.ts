import prisma from './prisma';  // prisma client import
import logger from '../utils/logger';

export async function testDbConnection() {
  try {
    await prisma.$connect();
    logger.info('Database connected');
  } catch (err) {
    logger.error('Failed to connect to the database:', err);
    process.exit(1);
  }
}