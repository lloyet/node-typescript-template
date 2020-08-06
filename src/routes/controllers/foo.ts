import { Request, Response, NextFunction } from 'express';

export default class Foo {

    public static bar(req: Request, res: Response, next: NextFunction) {
        console.log('bar');
        res.json({
            res: {
                foo: 'bar'
            }
        });
    }
}