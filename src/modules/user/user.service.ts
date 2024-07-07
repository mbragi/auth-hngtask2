import HttpException from "../../shared/exceptions/httpException.exception"
import { PrismaClient } from '@prisma/client'
import responseUtils from "../../shared/utils/response.utils"

const prisma = new PrismaClient()

class UserService {

    constructor() {}

    public async getOne(payload: any) {
        const { userId } = payload
        const user = await prisma.user.findUnique({
            where: {userId}
        })

        const response = responseUtils.buildResponse({ response: user, message: "Get user, successfull"})
        
        return response
        
    }

    public async getAll(payload: any) {
       
    }

} 


export default new UserService()