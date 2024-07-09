import express, { Application } from "express"
import { controller } from "./shared/types";
import morgan from "morgan";
import { errorHandler, notFound } from "./middleware";
import dotenv from "dotenv"
dotenv.config()


class App {
    private app: Application;

    constructor(constrollers: controller[]) {
        this.app = express()
        this.initMiddlewares()
        this.initControllers(constrollers)
        this.initErrorHandlers()
    }


    public listen() {
        this.app.listen(process.env.PORT || 4000, () => {
            console.log("app is listening on port 400");
        })
    }

    private initControllers(constrollers: controller[]) {
        constrollers.forEach((controller) => {
            console.log(`/api/hngtask2${controller.path}`)
            this.app.use(`/api/hngtask2`, controller.router)
        })
    }

    private initMiddlewares() {
        this.app.use(express.json())
        this.app.use(morgan('dev'))
    }

    private initErrorHandlers() {
        this.app.use(notFound)
        this.app.use(errorHandler)
    }
}

export default App
