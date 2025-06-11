import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors';

export const transferValidator = [
    body('fromWalletId').isInt({ min: 1 }).withMessage('Valid fromWalletId is required'),
    body('toWalletId').isInt({ min: 1 }).withMessage('Valid toWalletId is required'),
    body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
    handleValidationErrors,
];
