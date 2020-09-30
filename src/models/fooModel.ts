import { Model, model, Document, Schema } from 'mongoose';
import { QuerySearch, QueryDetails, QueryRegister } from '../controllers/fooController';
import { IResponse, InternalError, QueryFieldError, QueryValuedError, QueryIdError, QueryFoundError } from '../recipes/responseRecipe';

interface IFooBase {
    foo: string
    bar: number,
};

export interface IFooSchema extends Document, IFooBase {
};

export interface IFoo extends IFooSchema {
};

interface IFooModel extends Model<IFoo> {
    search: (query: QuerySearch) => Promise<any>,
    details: (query: QueryDetails) => Promise<any>,
    register: (query: QueryRegister) => Promise<any>
};

export const FooSchema: Schema<IFoo> = new Schema<IFoo>({
    foo: { type: String, required: true },
    bar: { type: Number }
}, { timestamps:  true });

FooSchema.statics.search = function(query: QuerySearch): Promise<any> {
    return new Promise((resolve: (foos: IFoo[]) => void, reject: (err: IResponse) => void): void => {
        if (!query) {
            return (reject(QueryFieldError));
        } else {
            query.validate().then((mongoQuery: any): void => {
                Foo.find(mongoQuery).select('-__v -createddAt -updatedAt').then((foos: IFoo[]): void => {
                    if (foos.length > 0) {
                        return (resolve(foos));
                    } else {
                        return (reject(QueryFoundError));
                    }
                }).catch((err: any): void => {
                        return (reject(InternalError));
                });
            }).catch((): void => {
                return (reject(QueryValuedError));
            });
        }
    });
};

FooSchema.statics.details = function(query: QueryDetails): Promise<any> {
    return new Promise((resolve: (foo: IFoo) => void, reject: (err: IResponse) => void): void => {
        if (!query) {
            return (reject(QueryFieldError));
        } else {
            query.validate().then((mongoQuery: any): void => {
                Foo.findById(mongoQuery).select('-_id -__v -createdAt -updatedAt').then((foo: IFoo | null): void => {
                    if (!foo) {
                        return (reject(QueryIdError));
                    } else {
                        return (resolve(foo));
                    }
                }).catch((err: any): void => {
                    return (reject(InternalError));
                });
            }).catch((): void => {
                return (reject(QueryValuedError));
            });
        }
    });
};

FooSchema.statics.register = function(query: QueryRegister): Promise<any> {
    return new Promise((resolve: (foos: any) => void, reject: (err: IResponse) => void): void => {
        if (!query) {
            return (reject(QueryFieldError));
        } else {
            query.validate().then((mongoQuery: any): void => {
                new Foo(mongoQuery).save().then((foo: IFoo): void => {
                    return (resolve({ id: foo._id }));
                }).catch((err: any): void => {
                        return (reject(InternalError));
                });
            }).catch((): void => {
                return (reject(QueryValuedError));
            });
        }
    });
};

export const Foo: IFooModel = model<IFoo, IFooModel>('Foo', FooSchema);