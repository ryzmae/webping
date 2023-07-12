import express, { Express, NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

import { Logger } from './utils/Logger';
import { UserModel } from './schemas/UserSchema'

const logger: any = new Logger({
    info: true,
    error: true,
    warn: true,
    debug: true
});

const app: Express = express();
const server: http.Server = http.createServer(app);

const mongo: string | undefined = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.1';
const port: number = Number(process.env.PORT) || 3000;
const secret: string = process.env.SECRET_KEY || 'secret';

mongoose.connect(mongo)
    .then(() => logger.info('Connected to MongoDB'))
    .catch((err: Error) => logger.error(err));

app.use(cors({
    credentials: true,
}));

app.use(bodyParser.json());

app.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword: string = await bcrypt.hash(password, 10);
        const user = new UserModel({
            name,
            email,
            password: hashedPassword
        });
        await user.save();

        res.status(201).json({ message: 'User created' });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    const { name, password } = req.body;

    try {
        const user = await UserModel.findOne({ name });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid: boolean = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token: string = jwt.sign({ name}, secret, { expiresIn: '1h' });

        res.status(200).json({ message: "Successfully logged in!", token });
    } catch (err) {
        logger.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/protected', async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded: any = jwt.verify(token, secret);

        if (decoded) {
            return res.status(200).json({ message: 'Access granted' });
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (err) {
        logger.error(err);
        res.status(401).json({ message: 'Unauthorized' });
    }
});


server.listen(port, () => { 
    logger.info(`Server is listening on port ${port}`);
});