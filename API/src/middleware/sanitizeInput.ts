import { Request, Response, NextFunction } from 'express';
import xss from 'xss';

const sanitize = (value: any): any => {
  if (typeof value === 'string') {
    return xss(value.trim());
  }

  if (Array.isArray(value)) {
    return value.map(sanitize);
  }

  if (value && typeof value === 'object') {
    const sanitizedObj: any = {};
    for (const key in value) {
      sanitizedObj[key] = sanitize(value[key]);
    }
    return sanitizedObj;
  }

  return value;
};

export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = sanitize(req.body);
  }

  if (req.query) {
    req.query = sanitize(req.query);
  }

  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
};