import { Request, Response, NextFunction } from 'express';
import { Foo } from '../models/fooModel';
import { handShake, recipLookUp } from '../utils';
import { IResponse } from '../types';

export class QuerySearch {
    public foo: string = ''
    public bar?: number = undefined

    public validate(): Promise<any> {
        return (new Promise((resolve: (query: any) => void, reject: (err: IResponse) => void): void => {
            recipLookUp(this.validator(), this).then((): void => {
                const query: any = {
                    foo: this.foo
                };
                if (this.bar) query.bar = this.bar;
                return resolve(query);
            }).catch((err: IResponse): void => {
                return (reject(err));
            });
        }));
    }

    private validator(): any {
        return ({
            foo: (foo: string) => foo !== '' ? true : false,
            bar: (bar: number) => bar > -1 ? true : false
        });
    }
};

export class QueryId {
    public id: string = ''

    public validate(): Promise<any> {
        return (new Promise((resolve: (query: any) => void, reject: (err: IResponse) => void): void => {
            recipLookUp(this.validator(), this).then((): void => {
                return (resolve(this.id));
            }).catch((err: IResponse): void => {
                return (reject(err));
            });
        }))
    }

    private validator(): any {
        return ({
            id: (id: string) => id !== '' ? true : false
        });
    }
};

export class QueryRegister {

    public foo: string = ''
    public bar: number = -1

    public validate(): Promise<any> {
        return (new Promise((resolve: (query: any) => void, reject: (err: IResponse) => void): void => {
            recipLookUp(this.validator(), this).then((): void => {
                return resolve({
                    foo: this.foo,
                    bar: this.bar
                });
            }).catch((err: IResponse): void => {
                return (reject(err));
            });
        }));
    }

    private validator(): any {
        return ({
            foo: (foo: string) => foo !== '' ? true : false,
            bar: (bar: number) => bar > -1 ? true : false
        });
    }
}

export class FooController {

    public searchHandler(req: Request, res: Response, next: NextFunction) {
        handShake([req.query], new QuerySearch()).then((recip: any): void => {
            Foo.search(recip).then((data: any): void => {
                res.status(200).json(data)
            }).catch((err: IResponse): void => {
                next(err);
            });
        }).catch((err: IResponse): void => {
            next(err);
        });
    }

    public detailsHandler(req: Request, res: Response, next: NextFunction) {
        handShake([req.params], new QueryId()).then((recip: any): void => {
            Foo.details(recip).then((data: any): void => {
                res.status(200).json(data);
            }).catch((err: IResponse): void => {
                next(err);
            });
        }).catch((err: IResponse): void => {
            next(err);
        });
    }

    public registerHandler(req: Request, res: Response, next: NextFunction) {
        handShake([req.body], new QueryRegister()).then((recip: any): void => {
            Foo.register(recip).then((data: any): void => {
                res.status(200).json(data)
            }).catch((err: IResponse): void => {
                next(err);
            });
        }).catch((err: IResponse): void => {
            next(err);
        });
    }
};
