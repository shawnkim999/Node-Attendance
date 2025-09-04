import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import { AuthPayload } from '../types/auth';

if (!process.env.JWT_SECRET) {
  logger.error('JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn(`Auth failed: Missing or malformed token. IP: ${req.ip}`);
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = decoded;
    next();
  } catch (err: unknown) {
    const tokenPreview = token.slice(0, 10) + '...';
    logger.warn(`Auth failed: Invalid token. IP: ${req.ip}, Token: ${tokenPreview}`, { error: err });
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  };
};
