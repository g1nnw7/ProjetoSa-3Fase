import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { authController } from "../controller/Auth/AuthController.js";

const authRouter = Router()

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post('/logout', auth, authController.logout);
authRouter.post('/change-password', auth, authController.changePassword);
authRouter.delete('/delete-account', auth, authController.deleteAccount);


export default authRouter;