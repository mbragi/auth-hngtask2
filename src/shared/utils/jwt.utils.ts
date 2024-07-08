import * as jwt from "jsonwebtoken"

export const generateToken = (userId: string, email: string, orgId: string) => {
    return jwt.sign({ userId, email, orgId}, process.env.JWT_SECRET!, {
        expiresIn: '30d'
    })
}


