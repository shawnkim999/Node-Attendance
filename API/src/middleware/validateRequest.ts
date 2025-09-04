import { ZodObject, ZodRawShape, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (schema: ZodObject<ZodRawShape>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body); // throws if invalid
    next();
  } catch (err: any) {
    return res.status(400).json({ error: err.errors });
  }
};