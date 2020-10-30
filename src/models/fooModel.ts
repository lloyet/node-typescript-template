import { Model, model, Document, Schema } from 'mongoose';
import { IResponse, InternalError, QueryIdError, QueryFoundError } from '../types';

interface IFooBase {
    foo: string
    bar: number,
};

export interface IFooSchema extends Document, IFooBase {
};

export interface IFoo extends IFooSchema {
};

interface IFooModel extends Model<IFoo> {
    search: (query: any) => Promise<any>,
    details: (query: any) => Promise<any>,
    register: (query: any) => Promise<any>
};

export const FooSchema: Schema<IFoo> = new Schema<IFoo>({
    foo: { type: String, required: true },
    bar: { type: Number }
}, { timestamps:  true });

FooSchema.statics.search = function(query: any): Promise<any> {
    return new Promise((resolve: (foos: IFoo[]) => void, reject: (err: IResponse) => void): void => {
        Foo.find(query)
        .select('-__v -createdAt -updatedAt')
        .then((foos: IFoo[]): void => {
            if (foos.length > 0) {
                return (resolve(foos));
            } else {
                return (reject(QueryFoundError));
            }
        }).catch((err: any): void => {
                return (reject(InternalError(err)));
        });
    });
};

FooSchema.statics.details = function(query: any): Promise<any> {
    return new Promise((resolve: (foo: IFoo) => void, reject: (err: IResponse) => void): void => {
        Foo.findById(query)
        .select('-_id -__v -createdAt -updatedAt')
        .then((foo: IFoo | null): void => {
            if (!foo) {
                return (reject(QueryIdError));
            } else {
                return (resolve(foo));
            }
        }).catch((err: any): void => {
            return (reject(InternalError(err)));
        });
    });
};

FooSchema.statics.register = function(query: any): Promise<any> {
    return new Promise((resolve: (foos: any) => void, reject: (err: IResponse) => void): void => {
        new Foo(query).save().then((foo: IFoo): void => {
            return (resolve({ id: foo._id }));
        }).catch((err: any): void => {
                return (reject(InternalError(err)));
        });
    });
};

export const Foo: IFooModel = model<IFoo, IFooModel>('Foo', FooSchema);