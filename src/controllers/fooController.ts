import { Request, Response, NextFunction } from 'express';
import { IFoo, Foo } from '../models/fooModel';
import { requestLookUp } from '../utils';
import { IResponse } from '../recipes/responseRecipe';

interface IQuerySearch {
    foo: string,
    bar?: number
};

export class QuerySearch implements IQuerySearch {
    public foo: string = ''
    public bar?: number = undefined

    public validate(): Promise<any> {
        return (new Promise((resolve: (mongoQuery: any) => void, reject: () => void): void => {
            if (!this.isValid()) {
                return reject();
            } else {
                const query: any = {
                    foo: this.foo
                };
                if (this.bar) {
                    query.bar = this.bar;
                }
                return resolve(query);
            }
        }));
    }

    private isValid(): boolean {
        return (this.foo !== '' ? true : false);
    }
};

interface IQueryDetails {
    id: string
};

export class QueryDetails implements IQueryDetails {
    public id: string = ''

    public validate(): Promise<any> {
        return (new Promise((resolve: (mongoQuery: any) => void, reject: () => void): void => {
            if (!this.isValid()) {
                return reject();
            } else {
                return resolve(this.id);
            }
        }));
    }

    private isValid(): boolean {
        return (this.id !== '' ? true : false);
    }
}

interface IQueryRegister {
    foo: string,
    bar: number
};

export class QueryRegister implements IQueryRegister {
    public foo: string = ''
    public bar: number = -1

    public validate(): Promise<any> {
        return (new Promise((resolve: (mongoQuery: any) => void, reject: () => void): void => {
            if (!this.isValid()) {
                return reject();
            } else {
                return resolve({
                    foo: this.foo,
                    bar: this.bar
                });
            }
        }));
    }

    private isValid(): boolean {
        return (this.foo !== ''
        && this.bar > -1
        ? true : false);
    }
}

export class FooController {

    public searchHandler(req: Request, res: Response, next: NextFunction) {
        Foo.search(requestLookUp([req.query], new QuerySearch())).then((data: any): void => {
            res.status(200).json(data)
        }).catch((err: IResponse): void => {
            next(err);
        });
    }

    public detailsHandler(req: Request, res: Response, next: NextFunction) {
        Foo.details(requestLookUp([req.params], new QueryDetails())).then((data: any): void => {
            res.status(200).json(data);
        }).catch((err: IResponse): void => {
            next(err);
        })
    }

    public registerHandler(req: Request, res: Response, next: NextFunction) {
        Foo.register(requestLookUp([req.body], new QueryRegister())).then((data: any): void => {
            res.status(201).json(data)
        }).catch((err: IResponse): void => {
            next(err);
        });
    }
}
