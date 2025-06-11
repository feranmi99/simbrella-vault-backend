import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors';


export const createWalletValidator = [
    body('userId').isInt({ min: 1 }).withMessage('Valid user ID is required'),
    body('currency').notEmpty().withMessage('Currency is required'),
    body('type')
        .isIn(['personal', 'business', 'savings'])
        .withMessage('Invalid wallet type. Must be one of: personal, business, savings'),
    handleValidationErrors,
];
