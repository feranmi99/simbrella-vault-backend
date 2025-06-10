// routes/userRoutes.ts
import { Router, Request, Response, NextFunction } from 'express';
import { Sequelize } from 'sequelize-typescript';
import { UserController } from '../controllers/UserController';
import { RegisterValidator } from '../validators/RegisterValidator'; // Assuming you have this

export function router(sequelize: Sequelize) {
    const router = Router();
    const userController = new UserController();

    // Get all users
    // router.get('/users', userController.getAllUsers.bind(userController));

    // Create user
    // router.post('/users', RegisterValidator, userController.createUser.bind(userController));

    // Get user by ID
    // router.get('/users/:id', userController.getUserById.bind(userController));

    // Update user by ID
    // router.put('/users/:id', userController.updateUser.bind(userController));

    // Delete user by ID
    // router.delete('/users/:id', userController.deleteUser.bind(userController));

    return router;
}