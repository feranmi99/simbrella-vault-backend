import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/apiError';
import User from '../models/UserModel.model';

// Extend the Express Request interface to include the user property
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                first_name: string;
                last_name: string;
                email: string;
                phone: string;
            };
        }
    }
}

interface JwtPayload {
    id: number;
}

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let token: string | undefined;

        // Get token from header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            throw new ApiError(401, 'Not authorized to access this route');
        }

        // Verify token
        if (!process.env.JWT_SECRET) {
            throw new ApiError(500, 'JWT secret not configured');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

        // Get user from the token
        const user = await User.findByPk(decoded.id);
        if (!user) {
            throw new ApiError(404, 'No user found with this id');
        }

        // Attach user to request object
        req.user = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
        };

        next();
    } catch (error) {
        next(error);
    }
};