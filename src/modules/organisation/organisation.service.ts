import HttpException from "../../shared/exceptions/httpException.exception"
import { PrismaClient } from '@prisma/client'
import responseUtils from "../../shared/utils/response.utils"

const prisma = new PrismaClient()

class OrganisationService {

    constructor() { }

    public async getOne(payload: any) {
        const organisations = await prisma.organisation.findFirst({
            where: { 
                orgId: payload.orgId,
                AND: [
                    {
                        OR: [
                            {creatorId: payload.userId},
                            {users: {some: { userId: payload.userId }}}
                        ]
                    }
                ]
             },

             select: {
                orgId: true,
                name: true,
                description: true
             }

            //  include: {
            //     users: true
            //  }
        })

        if (!organisations) {
            throw new HttpException(400, "Client error", "Bad request")
        }

        const response = responseUtils.buildResponse({ response: organisations, message: "get organisation successfully" })

        return response
    }

    public async getAll(payload: any) {

        console.log(payload);

        const organisations = await prisma.organisation.findMany({
            where: {
                OR: [
                    {creatorId: payload.userId}, 
                    {users: {some: { userId: payload.userId }}}
                ]
            },
            
            select: {
                orgId: true,
                name: true,
                description: true
             }

        })

        if (!organisations) {
            throw new HttpException(400, "Client error", "Bad request")
        }
        const response = {status: "Success", message: "get organisations successfully", organisations }

        return response
    }


    public async create(payload: any) {
        const { name, userId, description } = payload
        // console.log(payload);

        if (!name || !userId) {
            throw new HttpException(400, "Client error", "Bad request")
        }

        const organisation = await prisma.organisation.create({
            data: {
                name,
                description,
                creatorId: userId,
                users: {
                    connect: [{userId}]
                }
            },

            select: {
                orgId: true,
                name: true,
                description: true
            }

        })

        if(!organisation) {
            throw new HttpException(400, "Client error", "Bad request")
        }

        const response = responseUtils.buildResponse({ response: organisation, message: "Organisation created successfully" }) 
        // edit

        return response
    }

    public async createUser(payload: any) {
        const { orgId, userId } = payload
        console.log(payload);

        if (!userId || !orgId) {
            throw new HttpException(400, "Client error", "Bad request")
        }

        const organisation = await prisma.organisation.update({
            where: {orgId},
            data: {
                users: {
                    connect: [{userId: payload.userId}]
                }
            }
        })

        if(!organisation) {
            throw new HttpException(400, "Client error", "Bad request")
        }

        // const response = responseUtils.buildResponse({ response: organisation, message: "User added to organisation successfully" })
        return { status: "Success", message: "User added to organisation successfully" }
    }
}




export default new OrganisationService()