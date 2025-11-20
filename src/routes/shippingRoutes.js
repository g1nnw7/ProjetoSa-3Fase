import { Router } from "express";
import { shippingController } from "../controller/Shipping/ShippingController.js";

const shippingRouter = Router();

shippingRouter.post("/calculate", shippingController.calculateShipping);

export default shippingRouter;