import HttpException from "../../shared/exceptions/httpException.exception"
import { PrismaClient } from '@prisma/client'
import responseUtils from "../../shared/utils/response.utils"

const prisma = new PrismaClient()

class OrganisationService {

    constructor() {}

    public async getOne(payload: any) {

    }

    public async getAll(payload: any) {
       
    }

} 


export default new OrganisationService()