import { Router } from 'express';
import { FooController } from '../../../controllers/fooController';
import { NoneController } from '../../../controllers/multerController';

export default class FooRoutes {

    public router: Router
    private fooController: FooController = new FooController()

    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes(): void {
        this.router.get('/', this.fooController.searchHandler);
        this.router.get('/:id', this.fooController.detailsHandler);
        this.router.post('/', NoneController, this.fooController.registerHandler);
    }
};