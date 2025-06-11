import { Request, Response, NextFunction } from 'express';
import { WalletService } from '../services/wallet.service';

export class WalletController {
    private walletService: WalletService;

    constructor() {
        this.walletService = new WalletService();
    }

    // Create a new wallet for a user
    async createWallet(req: Request, res: Response, next: NextFunction) {
        try {
            const wallet = await this.walletService.createWallet(req.body.userId);
            res.status(201).json(wallet);
        } catch (error) {
            next(error);
        }
    }

    // Get all wallets (admin use)
    async getAllWallets(req: Request, res: Response, next: NextFunction) {
        try {
            const wallets = await this.walletService.getAllWallets();
            res.status(200).json(wallets);
        } catch (error) {
            next(error);
        }
    }

    // Get a specific wallet by ID
    async getWalletById(req: Request, res: Response, next: NextFunction) {
        try {
            const wallet = await this.walletService.getWalletById(Number(req.params.id));
            if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
            res.status(200).json(wallet);
        } catch (error) {
            next(error);
        }
    }

    // Get wallet by userId
    async getWalletByUserId(req: Request, res: Response, next: NextFunction) {
        try {
            const wallet = await this.walletService.getWalletByUserId(Number(req.params.userId));
            if (!wallet) return res.status(404).json({ message: 'Wallet not found for this user' });
            res.status(200).json(wallet);
        } catch (error) {
            next(error);
        }
    }

    // Fund wallet (mock)
    async fundWallet(req: Request, res: Response, next: NextFunction) {
        try {
            const { walletId, amount } = req.body;
            const updatedWallet = await this.walletService.fundWallet(walletId, amount);
            res.status(200).json(updatedWallet);
        } catch (error) {
            next(error);
        }
    }
}
