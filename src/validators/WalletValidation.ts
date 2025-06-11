import { body } from 'express-validator';
import { handleValidationErrors } from './RegisterValidator';


export const createWalletValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('currency').notEmpty().withMessage('Currency is required'),
    body('type')
        .isIn(['personal', 'business', 'savings'])
        .withMessage('Invalid wallet type. Must be one of: personal, business, savings'),
    handleValidationErrors,
];