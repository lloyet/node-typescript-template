import { Router } from 'express';
import ControllerError from './controllers/error';
import Api from './api';

export class Routes {

    public router: Router
    constructor() {
        this.router = Router();
        this.routes();
    }

    public routes(): void {
        this.router.use('/api', new Api().router);
        this.router.use(ControllerError.trigger);
    }
}

export const ErrorHandler = ControllerError.hanlder;