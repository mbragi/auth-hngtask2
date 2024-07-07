import * as jwt from "jsonwebtoken"

export const generateToken = (userId: number, email: string) => {
    return jwt.sign({ userId, email}, process.env.JWT_SECRET!, {
        expiresIn: '30d'
    })
}


