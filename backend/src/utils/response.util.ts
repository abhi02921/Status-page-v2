import { Response } from 'express';

export const successResponse = (res: Response, message: string, data: any = {}) => {
  return res.status(200).json({
    status: 'success',
    message,
    data,
  });
};

export const errorResponse = (res: Response, message: string, statusCode: number = 500) => {
  return res.status(statusCode).json({
    status: 'error',
    message,
  });
};
