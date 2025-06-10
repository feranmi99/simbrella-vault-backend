import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/apiError';

const errorHandler = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Set default values
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    const status = err instanceof ApiError ? err.status : 'error';
    const message = err.message;

    // Log the error
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', {
            statusCode,
            status,
            message,
            stack: err.stack
        });
    }

    // Send response
    res.status(statusCode).json({
        status,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export default errorHandler;