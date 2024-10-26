import { Request, Response, NextFunction } from 'express';

// Helper to handle async controller methods and catch errors
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
