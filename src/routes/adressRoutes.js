import { Router } from "express";
import { auth } from "../middleware/auth.js"; 
import { addressController } from "../controller/Adress/AdressController.js";

const addressRouter = Router();

addressRouter.get("/", auth, addressController.getAddresses);
addressRouter.post("/", auth, addressController.addAddress);
addressRouter.put("/:id", auth, addressController.updateAddress);
addressRouter.delete("/:id", auth, addressController.deleteAddress);

export default addressRouter;