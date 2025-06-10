import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
    database: process.env.DB_NAME || 'myapp',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: 'mysql',
    models: [__dirname + '/../models/**/*.model.ts'], // Path to your models
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

export async function testConnection(): Promise<void> {
    try {
        await sequelize.authenticate();
        console.log('✅ Sequelize connected successfully');

        // Sync models with database
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
        }
    } catch (error) {
        console.error('❌ Sequelize connection error:', error);
        throw error;
    }
}

export default sequelize;