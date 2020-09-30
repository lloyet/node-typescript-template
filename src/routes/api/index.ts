import { Router } from 'express';
import FooRoutes from './foos';

export default class ApiRoutes {

    public router: Router
    private fooRoutes: FooRoutes = new FooRoutes()

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes(): void {
        this.router.use('/foos', this.fooRoutes.router);
    }
};