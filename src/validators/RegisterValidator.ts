// validators/RegisterValidator.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const RegisterValidator = [
    // Add your validation rules here
    // Example:
    // body('email').isEmail().normalizeEmail(),
    // body('password').isLength({ min: 6 }),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];