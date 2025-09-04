import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const errorHandler = async (err: Error, req: Request, res: Response, next: NextFunction): Promise<void> => {
  logger.error(err.message);
  res.status(500).json({ error: 'Internal Server Error' });
};