import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as jwt from "jsonwebtoken"

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    console.log("Oh chim")
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 'Unauthorized',
            message: 'Access token is missing or invalid',
            statusCode: 401,
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        console.log(decoded);
        (req as any).user = decoded
        next()
    } catch (error: any) {
        res.status(401).json({
            status: "Unauthorized",
            message: 'Authentication failed',
            statusCode: StatusCodes.UNAUTHORIZED
        });
    }
}