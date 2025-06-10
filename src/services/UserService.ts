import bcrypt from 'bcryptjs';
import User from '../models/UserModel.model';
import jwt from 'jsonwebtoken';

export class UserService {
  async getAllUsers() {
    return await User.findAll();
  }

  async createUser(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return await User.create({ ...userData, password: hashedPassword });
  }

  async getUserById(userId: number) {
    return await User.findByPk(userId);
  }

  async updateUser(userId: number, userData: any) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    return await user.update(userData);
  }

  async deleteUser(userId: number) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');

    await user.destroy();
    return { message: 'User deleted successfully' };
  }

  async loginUser(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    const { password: _, ...userWithoutPassword } = user.get({ plain: true });

    return { user: userWithoutPassword, token };
  }
}
