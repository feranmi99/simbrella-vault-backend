import Wallet from '../models/WalletModel.model';
import Transaction, { TransactionType } from '../models/TransactionMOdel.model';
import sequelize from '../config/db';

export class TransactionService {
    // Transfer funds between wallets
    async transfer(fromWalletId: number, toWalletId: number, amount: number) {
        if (fromWalletId === toWalletId) throw new Error('Cannot transfer to the same wallet');
        if (amount <= 0) throw new Error('Transfer amount must be greater than zero');

        return await sequelize.transaction(async (t) => {
            const fromWallet = await Wallet.findByPk(fromWalletId, { transaction: t });
            const toWallet = await Wallet.findByPk(toWalletId, { transaction: t });

            if (!fromWallet) throw new Error('Sender wallet not found');
            if (!toWallet) throw new Error('Recipient wallet not found');
            if (fromWallet.balance < amount) throw new Error('Insufficient funds');

            // Update balances
            fromWallet.balance -= amount;
            toWallet.balance += amount;

            await fromWallet.save({ transaction: t });
            await toWallet.save({ transaction: t });

            // 👇 Pass correct typing here
            const transaction = await Transaction.create({
                fromWalletId,
                toWalletId,
                amount,
                type: TransactionType.TRANSFER,
                description: `Transfer from wallet ${fromWalletId} to ${toWalletId}`,
            } as any, { transaction: t }); // 👈 cast to any if needed as a temp fix

            return { success: true, transaction };
        });
    }

    // Get all transactions
    async getAllTransactions() {
        return await Transaction.findAll({
            include: [Wallet], // Optional: include wallet details
            order: [['createdAt', 'DESC']],
        });
    }

    // Get a single transaction by ID
    async getTransactionById(id: number) {
        const tx = await Transaction.findByPk(id);
        if (!tx) throw new Error('Transaction not found');
        return tx;
    }

    // Optional generic transaction creator
    async createTransaction(data: {
        fromWalletId?: number;
        toWalletId?: number;
        amount: number;
        type: TransactionType;
        description?: string;
    }) {
        if (data.amount <= 0) throw new Error('Transfer amount must be greater than zero');
        return await Transaction.create(data as any);
    }

    // Admin-only: update a transaction
    async updateTransaction(id: number, data: Partial<typeof Transaction>) {
        const transaction = await Transaction.findByPk(id);
        if (!transaction) throw new Error('Transaction not found');
        return await transaction.update(data as any);
    }

    // Admin-only: delete a transaction
    async deleteTransaction(id: number) {
        const transaction = await Transaction.findByPk(id);
        if (!transaction) throw new Error('Transaction not found');
        await transaction.destroy();
    }
}
