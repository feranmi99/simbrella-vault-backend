import Wallet from '../models/WalletModel.model';
import Transaction, { TransactionStatus, TransactionType } from '../models/TransactionMOdel.model';
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
        if (data.amount <= 0) throw new Error('Transaction amount must be greater than zero');

        return await sequelize.transaction(async (t) => {
            const { fromWalletId, toWalletId, amount, type, description } = data;

            if (type === TransactionType.TRANSFER) {
                if (!fromWalletId || !toWalletId) {
                    throw new Error('Both fromWalletId and toWalletId are required for transfer');
                }

                const fromWallet = await Wallet.findByPk(fromWalletId, { transaction: t });
                const toWallet = await Wallet.findByPk(toWalletId, { transaction: t });

                if (!fromWallet) throw new Error('Sender wallet not found');
                if (!toWallet) throw new Error('Recipient wallet not found');

                const senderBalance = parseFloat(fromWallet.balance as unknown as string);
                if (senderBalance < amount) throw new Error('Insufficient funds');

                // Update balances
                fromWallet.balance = parseFloat((senderBalance - amount).toFixed(2));
                toWallet.balance = parseFloat((parseFloat(toWallet.balance as unknown as string) + amount).toFixed(2));

                await fromWallet.save({ transaction: t });
                await toWallet.save({ transaction: t });

                // Create DEBIT transaction for sender
                await Transaction.create({
                    fromWalletId,
                    amount,
                    type: TransactionType.DEBIT,
                    description: description || `Transfer to wallet ${toWalletId}`,
                    date: new Date(),
                    status: TransactionStatus.COMPLETED,
                } as any, { transaction: t });

                // Create CREDIT transaction for receiver
                await Transaction.create({
                    toWalletId,
                    amount,
                    type: TransactionType.CREDIT,
                    description: description || `Transfer from wallet ${fromWalletId}`,
                    date: new Date(),
                    status: TransactionStatus.COMPLETED,
                } as any, { transaction: t });

                return { message: 'Transfer completed' };
            }

            // Handle DEBIT or CREDIT
            if (type === TransactionType.DEBIT) {
                if (!fromWalletId) throw new Error('fromWalletId is required for debit');

                const fromWallet = await Wallet.findByPk(fromWalletId, { transaction: t });
                if (!fromWallet) throw new Error('Wallet not found');

                const currentBalance = parseFloat(fromWallet.balance as unknown as string);
                if (currentBalance < amount) throw new Error('Insufficient funds');

                fromWallet.balance = parseFloat((currentBalance - amount).toFixed(2));
                await fromWallet.save({ transaction: t });

                return await Transaction.create({
                    fromWalletId,
                    amount,
                    type,
                    description,
                    date: new Date(),
                    status: TransactionStatus.COMPLETED,
                } as any, { transaction: t });
            }

            if (type === TransactionType.CREDIT) {
                if (!toWalletId) throw new Error('toWalletId is required for credit');

                const toWallet = await Wallet.findByPk(toWalletId, { transaction: t });
                if (!toWallet) throw new Error('Wallet not found');

                const currentBalance = parseFloat(toWallet.balance as unknown as string);
                toWallet.balance = parseFloat((currentBalance + amount).toFixed(2));
                await toWallet.save({ transaction: t });

                return await Transaction.create({
                    toWalletId,
                    amount,
                    type,
                    description,
                    date: new Date(),
                    status: TransactionStatus.COMPLETED,
                } as any, { transaction: t });
            }

            throw new Error('Invalid transaction type');
        });
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
