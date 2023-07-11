import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

import { Logger } from './utils/Logger';
import { httpsWebPing, httpWebPing } from './webping';

const logger: any = new Logger({
    info: true,
    error: true,
    warn: true,
    debug: true
});

const app: Express = express();
const server: http.Server = http.createServer(app);

const port: number = Number(process.env.PORT) || 3000;

app.use(cors({
    credentials: true,
}));

app.use(bodyParser.json());

server.listen(port, () => {
    logger.info(`Server is listening on port ${port}`);
});