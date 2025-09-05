import { z } from 'zod';

export const createUserSchema = z.object({
  username: z.string().min(3, "Username too short").max(32, "Username too long"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(['USER', 'ADMIN']).optional().default('USER'),
});

export const loginUserSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});