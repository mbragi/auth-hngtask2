export default class HttpException extends Error {

    public status: string
    public statusCode: number

    constructor(statusCode: number, message: string, status: string){
        super(message)
        this.status = status
        this.statusCode = statusCode
    }
}