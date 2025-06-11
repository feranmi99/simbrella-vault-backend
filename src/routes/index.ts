// routes/userRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { Sequelize } from 'sequelize-typescript';
import { UserController } from '../controllers/UserController';
import { RegisterValidator } from '../validators/RegisterValidator'; // Assuming you have this
import { LoginValidator } from '../validators/LoginValidator';
import { WalletController } from '../controllers/WalletController';
import { TransactionController } from '../controllers/TransactionController';
import { createWalletValidator } from '../validators/WalletValidation';
import { protect } from '../middlewares/authMiddleware';

export function router(sequelize: Sequelize) {
    const router = Router();
    const userController = new UserController();
    const walletController = new WalletController();
    const transactionController = new TransactionController();

    router.post('/register', RegisterValidator, userController.createUser.bind(userController));
    router.post('/login', LoginValidator, userController.loginUser.bind(userController));

    // Create a new wallet (with wallet type)
    router.post('/wallets/create',protect ,createWalletValidator, walletController.createWallet.bind(walletController));

    // Get all wallets (admin only)
    router.get('/wallets', walletController.getAllWallets.bind(walletController));

    // Get a wallet by wallet ID
    router.get('/wallets/:id', walletController.getWalletById.bind(walletController));

    // Get all wallets by user ID
    router.get('/users/:userId/wallets', walletController.getWalletsByUser.bind(walletController));

    // Get a specific wallet by user ID and wallet type (e.g., personal, business, savings)
    router.get('/users/:userId/wallets/:type', walletController.getWalletByUserIdAndType.bind(walletController));

    // Fund a wallet
    router.post('/wallets/fund', walletController.fundWallet.bind(walletController));


    // Get all users
    // router.get('/users', userController.getAllUsers.bind(userController));

    // Get user by ID
    // router.get('/users/:id', userController.getUserById.bind(userController));

    // Update user by ID
    // router.put('/users/:id', userController.updateUser.bind(userController));

    // Delete user by ID
    // router.delete('/users/:id', userController.deleteUser.bind(userController));

    return router;
}