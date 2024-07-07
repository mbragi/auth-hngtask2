import App from "."
import AuthControllers from "./modules/auth/auth.controllers"
import OrgControllers from "./modules/organisation/organisation.controller"
import UserControllers from "./modules/user/user.controller"

const app = new App([new AuthControllers(), new OrgControllers(), new UserControllers()])

app.listen()