import { z } from 'zod';
import logger from '../utils/logger';

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(10),
    NODE_ENV: z.enum(['development', 'production']).default('development'),
});

const result = envSchema.safeParse(process.env);
if (!result.success) {
    const tree = z.treeifyError(result.error);
    logger.error('Invalid environment variables:', tree);
    process.exit(1);
}

export const env = result.data;
