import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { orderController } from "../controller/Order/OrderController.js";

const orderRouter = Router();

orderRouter.get("/my-orders", auth, orderController.getMyOrders);

export default orderRouter;