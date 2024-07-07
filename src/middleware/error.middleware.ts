import { Request, Response, NextFunction } from "express";

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.statusCode || 500
    const message = error.message || "Something went wrong"

    res.status(statusCode).json({
        status: error.status || "Bad request",
        message: message,
        statusCode: statusCode || 500
    })
}