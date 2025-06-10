import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bodyParser from 'body-parser';
import path from 'path';

export function configureServer(app: Express): void {
    // Security
    app.use(helmet());

    // Rate limiting
    if (process.env.NODE_ENV === 'production') {
        app.use(rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100
        }));
    }

    // Body parsing
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

    // CORS
    app.use(cors({
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Static files
    app.use('/public', express.static(path.join(__dirname, '../../public')));
}