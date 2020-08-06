import { Request, Response, NextFunction } from 'express';
import { InvalidPath } from '../../types/routerError';

export default class ControllerError {

    public static trigger(req: Request, res: Response, next: NextFunction): void {
        next(new InvalidPath(req.method));
    };

    public static hanlder(err: any, req: Request, res: Response, next: NextFunction): void {
        res.status(err.status || 500);
        res.json({
            error: {
                name: err.name,
                message: err.message,
                status: err.status,
            }
        })
    }
}