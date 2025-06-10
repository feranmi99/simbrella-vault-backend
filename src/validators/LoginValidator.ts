import { body } from 'express-validator';
import { handleValidationErrors } from './RegisterValidator'; // Reuse the function

export const LoginValidator = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    handleValidationErrors
];
