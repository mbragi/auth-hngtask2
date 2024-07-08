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
        this.router.post(`${this.path}/`, verifyToken, this.create)
        this.router.patch(`${this.path}/:orgId/users`, verifyToken, this.createUser)
        this.router.get(`${this.path}/:orgId`, verifyToken, this.getOne)
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = (req as any).user
            const response = await organisationService.getAll({ userId: userId})
            res.status(200).json(response)
        } catch (error) {
            next(error)
        }
    }

    public async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { orgId } = req.params
            const { userId } = (req as any).user
            const response = await organisationService.getOne({ orgId: orgId, userId})
            res.status(200).json(response)
        } catch (error) {
            next(error)
        }
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const {userId} = (req as any).user
            const response = await organisationService.create({ userId: userId, ...req.body})
            res.status(200).json(response)
        } catch (error) {
            next(error)
        }
    }

    public async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const {userId} = req.body
            const { orgId } = req.params
            const response = await organisationService.createUser({ orgId, userId})
            res.status(200).json(response)
        } catch (error) {
            next(error)
        }
    }
}

export default OrgControllers