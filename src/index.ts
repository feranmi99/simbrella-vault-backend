import dotenv from 'dotenv';

dotenv.config();

import App from './app';
import 'reflect-metadata'; 


const port = parseInt(process.env.PORT || '5555');
const app = new App(port);

app.start();