import 'reflect-metadata'; // Required for sequelize-typescript
import dotenv from 'dotenv';
import App from './app';

dotenv.config();

const port = parseInt(process.env.PORT || '5555');
const app = new App(port);

app.start();