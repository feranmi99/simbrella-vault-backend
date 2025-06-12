import { Request, Response, NextFunction } from 'express';
import { WalletService } from '../services/wallet.service';

export class WalletController {
    private walletService: WalletService;

    constructor() {
        this.walletService = new WalletService();
    }

    // Create a new wallet for a user
    async createWallet(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id; // ✅ use the id from protect middleware
            const { type, name } = req.body;

            if (!userId) {
                res.status(401).json({ message: 'Unauthorized: No user ID found' });
                return;
            }

            if (!name) {
                res.status(400).json({ message: 'Invalid wallet name' });
                return;
            }

            // Optional: validate type
            if (!['personal', 'business', 'savings'].includes(type)) {
                res.status(400).json({ message: 'Invalid wallet type' });
                return;
            }

            const wallet = await this.walletService.createWallet(userId, type, name);
            res.status(201).json(wallet);
        } catch (error) {
            next(error);
        }
    }


    // Get all wallets (admin use)
    async getAllWallets(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const wallets = await this.walletService.getAllWallets();
            res.status(200).json(wallets);
        } catch (error) {
            next(error);
        }
    }

    // Get a specific wallet by ID
    async getWalletById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const wallet = await this.walletService.getWalletById(Number(req.params.id));
            if (!wallet) {
                res.status(404).json({ message: 'Wallet not found' });
                return;
            }
            res.status(200).json(wallet);
        } catch (error) {
            next(error);
        }
    }

    // Get wallet by userId
    async getWalletByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const wallet = await this.walletService.getWalletByUserId(Number(req.params.userId));
            if (!wallet) {
                res.status(404).json({ message: 'Wallet not found for this user' });
                return;
            }
            res.status(200).json(wallet);
        } catch (error) {
            next(error);
        }
    }

    // Fund wallet (mock)
    async fundWallet(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { walletId, amount } = req.body;
            const updatedWallet = await this.walletService.fundWallet(walletId, amount);
            res.status(200).json(updatedWallet);
        } catch (error) {
            next(error);
        }
    }

    async getWalletsByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id;
            const wallets = await this.walletService.getWalletsByUser(Number(userId));
            res.status(200).json(wallets);
        } catch (error) {
            next(error);
        }
    }

    async getWalletByUserIdAndType(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = Number(req.params.userId);
            const type = req.params.type as 'personal' | 'business' | 'savings';

            const wallet = await this.walletService.getWalletByUserIdAndType(userId, type);
            if (!wallet) {
                res.status(404).json({ message: 'Wallet not found for this type' });
                return;
            }

            res.status(200).json(wallet);
        } catch (error) {
            next(error);
        }
    }
}
