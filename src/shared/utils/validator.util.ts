
 import { Request, Response, NextFunction, RequestHandler } from "express";
import Joi from 'joi'

const validate = (schema: Joi.Schema): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const validationOptions = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        };

        try {
            const data = await schema.validateAsync(req.body, validationOptions)
            req.body = data
            next()
        } catch (e: any) {
            const errors: any = [];

            e.details.forEach((error: Joi.ValidationErrorItem) => {
                errors.push({
                    field: error.path[0],
                    message: error.message
                })
            });

            res.status(422).json({
                errors: [errors]
            })
        }



    }
}   



export default validate