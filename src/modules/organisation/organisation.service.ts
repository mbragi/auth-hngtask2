import HttpException from "../../shared/exceptions/httpException.exception"
import { PrismaClient } from '@prisma/client'
import responseUtils from "../../shared/utils/response.utils"

const prisma = new PrismaClient()

class OrganisationService {

    constructor() { }

    public async getOne(payload: any) {
        const organisations = await prisma.organisation.findUnique({
            where: { orgId: payload.orgId }
        })

        if (!organisations) {
            throw new HttpException(400, "Client error", "Bad request")
        }
        return organisations
    }

    public async getAll(payload: any) {
        const organisation = await prisma.organisation.findMany({
            where: { userId: payload.userId }
        })

        const response = responseUtils.buildResponse({ response: organisation, message: "get organisation successfully" })

        return response
    }


    public async create(payload: any) {
        const { name, userId } = payload
        console.log(payload);

        if (!name || !userId) {
            throw new HttpException(400, "Client error", "Bad request")
        }
        const organisation = await prisma.organisation.create({
            data: {
                name,
                user: {
                    connect: {
                        userId
                    }
                }
            }
        })



        const response = responseUtils.buildResponse({ response: organisation, message: "Organisation created successfully" })

        return response
    }

    public async createUser(payload: any) {
        const { name, orgId, userId } = payload
        console.log(payload);

        if (!userId || !orgId) {
            throw new HttpException(400, "Client error", "Bad request")
        }

        const organisation = await prisma.organisation.update({
            where: { orgId },
            data: {
                userId: Number(userId)
            }
        })

        return organisation
    }
}




export default new OrganisationService()