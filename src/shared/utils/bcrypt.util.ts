import bcrypt from "bcryptjs"


interface passwordHash {
    saltRounds: number,
    password: string
}

export class bcryptUtils {

    public async hashPassword({saltRounds, password}: passwordHash) {
        const salt = await bcrypt.genSalt(saltRounds)
        return await bcrypt.hash(password, salt)
    }

    public async compare(password: string, passwordHash: string) {
        return await bcrypt.compare(password, passwordHash);
    }
}