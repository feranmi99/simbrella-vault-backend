import { Request, Response, NextFunction } from 'express';
import { TransactionService } from '../services/transaction.service';

export class TransactionController {
    private transactionService: TransactionService;

    constructor() {
        this.transactionService = new TransactionService();
    }

    // Create a new transaction
    async createTransaction(req: Request, res: Response, next: NextFunction) {
        try {
            const transaction = await this.transactionService.createTransaction(req.body);
            res.status(201).json(transaction);
        } catch (error: any) {
            if (error.name === 'SequelizeValidationError') {
                const messages = error.errors.map((e: any) => e.message);
                res.status(400).json({
                    message: 'Invalid transaction input',
                    errors: messages,
                });
                return;
            }

            res.status(500).json({
                message: 'Something went wrong while creating the transaction.',
            });
        }
    }

    // Get all transactions
    async getAllTransactions(req: Request, res: Response, next: NextFunction) {
        try {
            const transactions = await this.transactionService.getAllTransactions();
            res.status(200).json(transactions);
        } catch (error) {
            next(error);
        }
    }

    // Get a transaction by ID
    async getTransactionById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const transaction = await this.transactionService.getTransactionById(id);
            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found' });
            }
            res.json(transaction);
        } catch (error) {
            next(error);
        }
    }

    // Update a transaction
    async updateTransaction(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const updatedTransaction = await this.transactionService.updateTransaction(id, req.body);
            res.json(updatedTransaction);
        } catch (error) {
            next(error);
        }
    }

    // Delete a transaction
    async deleteTransaction(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            await this.transactionService.deleteTransaction(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}
