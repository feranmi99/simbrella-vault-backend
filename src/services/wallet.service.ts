import Wallet from '../models/WalletModel.model';
import User from '../models/UserModel.model';
import crypto from 'crypto';

export class WalletService {
    // Create a new wallet for a user
    async createWallet(userId: number, type: 'personal' | 'business' | 'savings') {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('User not found');

        // Ensure user doesn't already have this type of wallet
        const existingWallet = await Wallet.findOne({ where: { userId, type } });
        if (existingWallet) throw new Error(`User already has a ${type} wallet`);

        return await Wallet.create({
            userId,
            balance: 0,
            currency: 'NGN',
            type,
            accountNumber: this.generateAccountNumber(),
            walletAddress: `0x${crypto.randomBytes(20).toString('hex')}`

        });
    }


    // Get all wallets
    async getAllWallets() {
        return await Wallet.findAll({ include: [User] });
    }

    // Get wallet by wallet ID
    async getWalletById(walletId: number) {
        return await Wallet.findByPk(walletId, { include: [User] });
    }

    // Get wallet by user ID
    async getWalletByUserId(userId: number) {
        return await Wallet.findOne({ where: { userId }, include: [User] });
    }

    // Fund a wallet
    async fundWallet(walletId: number, amount: number) {
        const wallet = await Wallet.findByPk(walletId);
        if (!wallet) throw new Error('Wallet not found');

        wallet.balance += amount;
        await wallet.save();
        return wallet;
    }

    async getWalletsByUser(userId: number) {
        return await Wallet.findAll({ where: { userId }, include: [User] });
    }

    async getWalletByUserIdAndType(userId: number, type: 'personal' | 'business' | 'savings') {
        return await Wallet.findOne({ where: { userId, type }, include: [User] });
    }



    // Optional: generate dummy NUBAN-style account number
    private generateAccountNumber(): string {
        return '10' + Math.floor(100000000 + Math.random() * 900000000).toString(); // 10-digit account number
    }
}
