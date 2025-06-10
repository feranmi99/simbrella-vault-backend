// controllers/UserController.ts
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    /**
     * Get all users
     */
    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.userService.getAllUsers();
            res.json(users);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create a new user
     */
    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.userService.createUser(req.body);
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get user by ID
     */
    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.userService.getUserById(parseInt(req.params.id));
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update user by ID
     */
    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.userService.updateUser(
                parseInt(req.params.id),
                req.body
            );
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete user by ID
     */
    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            await this.userService.deleteUser(parseInt(req.params.id));
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}