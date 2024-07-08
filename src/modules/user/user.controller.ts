import { Request, Response, NextFunction, Router } from "express";
import { controller } from "../../shared/types";
import userService from "./user.service";
import { verifyToken } from "../../middleware/auth.middleware";

class UserControllers implements controller {
    public path: string = '/users';
    public router: Router = Router()

    constructor() {
        this.loadRoutes()
    }

    public loadRoutes() {

        this.router.get(`${this.path}/health`, (req: Request, res: Response) => {
            res.status(200).json({ message: "User Service is working" })
        })

        this.router.get(`${this.path}/`, verifyToken, this.getAll)
        this.router.get(`${this.path}/:userId`, verifyToken, this.getOne)
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, email, orgId } = (req as any).user
            // const response = await userService.getAll({userId, email})
            res.status(200).json()
        } catch (error) {
            next(error)
        }

    }

    public async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params
            const { userId: user, email, orgId } = (req as any).user
            const response = await userService.getOne({ userId: userId, user, orgId })
            res.status(200).json(response)
        } catch (error) {
            next(error)
        }
    }
}

export default UserControllers