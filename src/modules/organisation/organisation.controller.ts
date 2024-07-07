import { Request, Response, NextFunction, Router } from "express";
import { controller } from "../../shared/types";
import organisationService from "./organisation.service";
import { verifyToken } from "../../middleware/auth.middleware";

class OrgControllers implements controller {
    public path: string = '/organisations';
    public router: Router = Router()

    constructor() {
        this.loadRoutes()
    }

    public loadRoutes() {

        this.router.get(`${this.path}/health`, (req: Request, res: Response) => {
            res.status(200).json({ message: "Org Service is working" })
        })

        this.router.get(`${this.path}/`, verifyToken, this.getAll)
        this.router.post(`${this.path}/:orgId`, verifyToken, this.getOne)
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            // const response = await organisationService.getAll(req.body)
            res.status(200).json({msg: "Gba ko je"})
        } catch (error) {
            next(error)
        }

    }

    public async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            res.status(200).json({msg: "Gba ko je"})
        } catch (error) {
            next(error)
        }
    }
}

export default OrgControllers