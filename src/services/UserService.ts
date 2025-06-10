// services/UserService.ts
import { User } from '../models/UserModel';

export class UserService {
    /**
     * Get all users
     */
    async getAllUsers() {
        return await User.findAll();
    }

    /**
     * Create a new user
     * @param userData User data to create
     */
    async createUser(userData: any) {
        return await User.create(userData); 
    }

    /**
     * Get user by ID
     * @param userId User ID
     */
    async getUserById(userId: number) {
        return await User.findByPk(userId);
    }

    /**
     * Update user by ID
     * @param userId User ID
     * @param userData Updated user data
     */
    async updateUser(userId: number, userData: any) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return await user.update(userData);
    }

    /**
     * Delete user by ID
     * @param userId User ID
     */
    async deleteUser(userId: number) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('User not found');
        }
        await user.destroy();
        return { message: 'User deleted successfully' };
    }
}