import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { paymentController } from "../controller/Payment/PaymentController.js";

const paymentRouter = Router();


paymentRouter.post("/create_preference", auth, paymentController.createPreference);

export default paymentRouter;