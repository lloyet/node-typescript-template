import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import { Routes, ErrorHandler } from './routes';
import { MONGODB_URI } from './config/secrets';

export default class Server {

    public app: express.Application
    constructor() {
        this.app = express();
        this.config();
        this.router();
        this.mongo();
    }

    public router(): void {
        this.app.use(new Routes().router);
        this.app.use(ErrorHandler);
    }

    public config(): void {
        this.app.set('PORT', process.env.PORT || 3000);
        this.app.use(
            helmet(),
            cors(),
            express.json(),
            express.urlencoded({ extended: false }),
            compression()
        );
    }

    private mongo(): void {
        const connection = mongoose.connection;
        connection.on('connected', () => {
            console.log(`Connected to ${MONGODB_URI}`);
        });
        connection.on('reconnected', () => {
            console.log(`Reconnected to ${MONGODB_URI}`);
        })
        connection.on('disconnected', () => {
            console.log(`Disconnecte from ${MONGODB_URI}\nTrying to reconnect to ${MONGODB_URI}`);
            setInterval(() => {
                mongoose.connect(MONGODB_URI, {
                    keepAlive: true,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    socketTimeoutMS: 3000,
                    connectTimeoutMS: 3000
                })
            }, 3000);
        });
        (async (): Promise<void> => {
            await mongoose.connect(MONGODB_URI, {
                    keepAlive: true,
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                }, (err) => {
                if (err) { console.error(err); }
            });
        })();
    }

    public start(): void {
        this.app.listen(this.app.get('PORT'), () => {
            console.log(`Listening on ${this.app.get('PORT')}`);
        })
    }
}