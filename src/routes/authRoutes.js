import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { authController } from "../controller/Auth/AuthController.js";

const authRouter = Router()

authRouter.post("/register", authController.register)
authRouter.post("/login", authController.login)
authRouter.post('/logout', auth, authController.logout);

//mudar senha de maneira segura
authRouter.post('/change-password', auth, authController.changePassword);


export default authRouter;