// routes/userRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { Sequelize } from 'sequelize-typescript';
import { UserController } from '../controllers/UserController';
import { RegisterValidator } from '../validators/RegisterValidator'; // Assuming you have this
import { LoginValidator } from '../validators/LoginValidator';
import { WalletController } from '../controllers/WalletController';
import { TransactionController } from '../controllers/TransactionController';
import { createWalletValidator } from '../validators/WalletValidation';

export function router(sequelize: Sequelize) {
    const router = Router();
    const userController = new UserController();
    const walletController = new WalletController();
    const transactionController = new TransactionController();

    router.post('/register', RegisterValidator, userController.createUser.bind(userController));
    router.post('/login', LoginValidator, userController.loginUser.bind(userController));

    router.post('/wallets', createWalletValidator, walletController.createWallet.bind(walletController));


    // router.get('/wallets', walletController.getUserWallets);

    // router.post('/transactions/transfer', transferValidator, transactionController.transfer);





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