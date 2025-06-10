import express, { Express, Request, Response, NextFunction } from 'express';
import { configureServer } from './config/server';
import sequelize, { testConnection } from './config/db';
import { router } from './routes';
import { ModelCtor } from 'sequelize-typescript';
import 'reflect-metadata'; // Required for sequelize-typescript

interface CustomRequest extends Request {
    db: typeof sequelize;
}

class App {
    public app: Express;
    public port: number;
    public db: typeof sequelize;

    constructor(port: number) {
        this.app = express();
        this.port = port;
        this.db = sequelize;

        this.initializeDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    private async initializeDatabase(): Promise<void> {
        try {
            await testConnection();
            console.log('✅ Database connection established');

            // Sync models in development
            if (process.env.NODE_ENV === 'development') {
                await this.db.sync({ alter: true });
                console.log('🔄 Database synced');
            }
        } catch (error) {
            console.error('❌ Database connection failed:', error);
            process.exit(1);
        }
    }

    private initializeMiddlewares(): void {
        configureServer(this.app);

        // Add sequelize instance to all requests
        // this.app.use((req: CustomRequest, res: Response, next: NextFunction) => {
        //     req.db = this.db;
        //     next();
        // });

        this.app.use((req: Request, res: Response, next: NextFunction) => {
            (req as CustomRequest).db = this.db;
            next();
        });
    }

    private initializeRoutes(): void {
        // Health check endpoint
        this.app.get('/', (req: Request, res: Response) => {
            res.status(200).json({
                message: 'API Service is running',
                status: true,
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV || 'development'
            });
        });

        // API routes with dependency injection
        this.app.use('/api/v1', router(this.db));
    }

    private initializeErrorHandling(): void {
        // 404 handler
        this.app.use((req: Request, res: Response) => {
            res.status(404).json({
                success: false,
                message: 'Resource not found',
                path: req.originalUrl
            });
        });

        // Error handler
        this.app.use((
            err: Error & { status?: number },
            req: Request,
            res: Response,
            next: NextFunction
        ) => {
            console.error(`[${new Date().toISOString()}] Error:`, err.stack);

            const status = err.status || 500;
            const message = process.env.NODE_ENV === 'production'
                ? 'Something went wrong'
                : err.message;

            res.status(status).json({
                success: false,
                message,
                ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
            });
        });
    }

    public async start(): Promise<void> {
        this.app.listen(this.port, () => {
            console.log(`
        🚀 Server running in ${process.env.NODE_ENV || 'development'} mode
        🔗 http://localhost:${this.port}
        📅 ${new Date().toLocaleString()}
      `);
        });
    }
}

export default App;