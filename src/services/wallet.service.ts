import Wallet from '../models/WalletModel.model';
import User from '../models/UserModel.model';
import crypto from 'crypto';
import Transaction, { TransactionStatus, TransactionType } from '../models/TransactionMOdel.model';
import { TransactionService } from './transaction.service';

export class WalletService {
    private transactionService = new TransactionService();

    // Create a new wallet for a user
    async createWallet(userId: number, type: 'personal' | 'business' | 'savings', name: string) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('User not found');

        // Ensure user doesn't already have this type of wallet
        const existingWallet = await Wallet.findOne({ where: { userId, type } });
        if (existingWallet) throw new Error(`User already has a ${type} wallet`);

        const wallet = await Wallet.create({
            userId,
            balance: 0,
            currency: 'NGN',
            type,
            name,
            accountNumber: this.generateAccountNumber(),
            walletAddress: `0x${crypto.randomBytes(20).toString('hex')}`
        });

        const systemWallet = await Wallet.findOne({
            where: { walletAddress: '0xd91f43e830db2c345dcfc57b0bdf9c17f2cf93b8' }
        });

        if (!systemWallet) {
            throw new Error('System wallet not found');
        }

        // Use the transactionService to log the welcome bonus
        await this.transactionService.createTransaction({
            fromWalletId: systemWallet.id,
            toWalletId: wallet.id,
            amount: 10000,
            type: TransactionType.TRANSFER,
            description: 'Welcome bonus on wallet creation',
        });

        const walletWithTransactions = await Wallet.findByPk(wallet.id, {
            include: [
                User,
                { model: Transaction, as: 'sentTransactions' },
                { model: Transaction, as: 'receivedTransactions' }]
        });

        return walletWithTransactions;
    }


    // Get all wallets
    async getAllWallets() {
        return await Wallet.findAll({
            include: [
                User,
                { model: Transaction, as: 'sentTransactions' },
                { model: Transaction, as: 'receivedTransactions' }
            ]
        });
    }

    // Get wallet by wallet ID
    async getWalletById(walletId: number) {
        return await Wallet.findByPk(walletId, {
            include: [
                User,
                { model: Transaction, as: 'sentTransactions' },
                { model: Transaction, as: 'receivedTransactions' }
            ]
        });
    }

    // Get wallet by user ID
    async getWalletByUserId(userId: number) {
        return await Wallet.findOne({
            where: { userId },
            include: [
                User,
                { model: Transaction, as: 'sentTransactions' },
                { model: Transaction, as: 'receivedTransactions' }
            ]
        });
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
        return await Wallet.findAll({
            where: { userId },
            include: [
                User,
                { model: Transaction, as: 'sentTransactions' },
                { model: Transaction, as: 'receivedTransactions' }
            ]
        });
    }

    async getWalletByUserIdAndType(userId: number, type: 'personal' | 'business' | 'savings') {
        return await Wallet.findOne({ where: { userId, type }, include: [User] });
    }



    // Optional: generate dummy NUBAN-style account number
    private generateAccountNumber(): string {
        return '10' + Math.floor(100000000 + Math.random() * 900000000).toString(); // 10-digit account number
    }
}
