import { IUser } from "../../shared/types"
import HttpException from "../../shared/exceptions/httpException.exception"
import { PrismaClient } from '@prisma/client'
import { bcryptUtils } from "../../shared/utils/bcrypt.util"
import responseUtils from "../../shared/utils/response.utils"
import { generateToken } from "../../shared/utils/jwt.utils"
import { ISignin } from "../../shared/utils/auth.types"

const prisma = new PrismaClient()

class AuthService {

    private bcrypt: bcryptUtils = new bcryptUtils() 
    constructor() {}

    public async signUp(payload: any) {

        const { email, password } = payload
        const userExists = await prisma.user.findUnique({
            where: {email}
        })
        // console.log(userExists)
        if (userExists) throw new HttpException(400, "user Already exist", "Bad Request")

        const hashPassword = await this.bcrypt.hashPassword({password, saltRounds: 12})

        payload.password = hashPassword
        
        console.log(hashPassword)

        const user = await prisma.user.create({ data: payload })
        console.log("new user created");

        const accessToken = generateToken(user.userId, user.email)

        const organisationName = `${user.firstName}'s organisation`

        const organisationData = {
            name: organisationName,
            description: "",
            userId: user.userId          
        }
        const organisation = await prisma.organisation.create({
            data: {
                ...organisationData,
                organisation: {
                    create: {
                      name: organisationName,
                    },
                  },
            }
        })
        
        const response = responseUtils.buildResponse({response: {accessToken, user}, message: "Registeration Successfull"})

        return response
    }


    public async signIn(payload: ISignin) {
        const { email, password } = payload

        if(!email || !password) throw new HttpException(401, "Authentication failed", "Bad request")
        
        const userExists = await prisma.user.findUnique({
            where: {email},
        })

        if(!userExists) throw new HttpException(401, "User not found", "Bad request")
        
        const isPasswordValid = await this.bcrypt.compare(password, userExists.password)

        if(!isPasswordValid) throw new HttpException(401, "Authentication failed", "Bad request")

        const accessToken = generateToken(userExists.userId, userExists.email)
        
        const response = responseUtils.buildResponse({response: {accessToken, user: userExists}, message: "Login successful"})

        return response

    }


} 


export default new AuthService()