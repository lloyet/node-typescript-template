import { Router } from 'express';
import FooController from '../controllers/foo';

export default class Api {

    router: Router
    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes(): void {
        this.router.get('/foo', FooController.bar);
    }
};