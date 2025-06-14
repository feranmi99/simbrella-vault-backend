import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }
    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.userService.getAllUsers();
            res.json(users);
        } catch (error) {
            next(error);
        }
    }

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.userService.createUser(req.body);
            res.status(201).json(user);
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                const field = error.errors?.[0]?.path;
                const value = error.errors?.[0]?.value;
                res.status(409).json({
                    message: `The ${field} "${value}" is already in use. Please use a different one.`,
                });
                return;
            }

            if (error.name === 'SequelizeValidationError') {
                const messages = error.errors.map((e: any) => e.message);
                res.status(400).json({
                    message: 'Invalid user input',
                    errors: messages,
                });
                return;
            }

            // Fallback for unknown errors
            res.status(500).json({
                message: 'Something went wrong while creating the user.',
            });
        }
    }

    async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;

            const result = await this.userService.loginUser(email, password);
            if (!result) {
                res.status(401).json({ message: 'Invalid email or password' });
                return;
            }

            res.status(200).json({
                message: 'Login successful',
                user: result.user,
                token: result.token,
            });
        } catch (error) {
            next(error);
        }
    }



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

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            await this.userService.deleteUser(parseInt(req.params.id));
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}