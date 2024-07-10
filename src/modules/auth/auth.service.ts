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
    constructor() { }

    public async signUp(payload: any) {

        const { email, password } = payload
        const userExists = await prisma.user.findUnique({
            where: { email }
        })
        // console.log(userExists)
        if (userExists) throw new HttpException(422, "Registration unsuccessful", "Bad Request")

        const hashPassword = await this.bcrypt.hashPassword({ password, saltRounds: 12 })

        payload.password = hashPassword

        // console.log(hashPassword)

        const user = await prisma.user.create({
            data: {
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                password: payload.password,
                phone: payload.phone,
                organisations: {
                    create: {
                        name: `${payload.firstName}'s organisation`
                    }
                }
            },

            include: {
                organisations: true
            },


        })

        if (!user) {
            throw new HttpException(422, "Registration unsuccessful", "Bad Request")

        }

        const organisation = await prisma.organisation.update({
            where: { orgId: user.organisations[0].orgId },
            data: { creatorId: user.userId }
        });

        console.log(organisation);


        console.log("new user created", user);

        const accessToken = generateToken(user.userId, user.email, user.organisations[0].orgId)

        const resUser = {
            userId: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone
        }
        const response = responseUtils.buildResponse({ response: { accessToken, user: resUser }, message: "Registeration Successfull" })

        return response
    }


    public async signIn(payload: ISignin) {
        const { email, password } = payload

        if (!email || !password) throw new HttpException(422, "Authentication failed", "Bad request")

        const userExists = await prisma.user.findUnique({
            where: { email },
            include: {
                organisations: true
            }
        })

        if (!userExists) throw new HttpException(401, "Authentication failed", "Bad request")

        const isPasswordValid = await this.bcrypt.compare(password, userExists.password)

        if (!isPasswordValid) throw new HttpException(401, "Authentication failed", "Bad request")

        const accessToken = generateToken(userExists.userId, userExists.email, userExists.organisations[0].orgId)

        const resUser = {
            userId: userExists.userId,
            firstName: userExists.firstName,
            lastName: userExists.lastName,
            email: userExists.email,
            phone: userExists.phone
        }

        const response = responseUtils.buildResponse({ response: { accessToken, user: resUser }, message: "Login successful" })

        return response

    }


}


export default new AuthService()