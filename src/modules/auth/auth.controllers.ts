import { Request, Response, NextFunction, Router } from "express";
import { controller } from "../../shared/types";
import authService from "./auth.service";
import validate from "../../shared/utils/validator.util";
import { userValidationSchema } from "../../shared/validation/user.validation";
import { bcryptUtils } from "../../shared/utils/bcrypt.util";

class AuthControllers implements controller {
    public path: string = '/auth';
    public router: Router = Router()

    constructor() {
        this.loadRoutes()
    }

    public loadRoutes() {

        this.router.get(`${this.path}/`, (req: Request, res: Response) => {
            res.status(200).json({ message: "Auth Service is working" })
        })

        this.router.post(`${this.path}/register`, validate(userValidationSchema), this.signUp)
        this.router.post(`${this.path}/login`, this.signin)
    }

    public async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await authService.signUp(req.body)
            res.status(201).json(response)
        } catch (error) {
            next(error)
        }

    }

    public async signin(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await authService.signIn(req.body)
            res.status(201).json(response)
        } catch (error) {
            next(error)
        }
    }
}

export default AuthControllers