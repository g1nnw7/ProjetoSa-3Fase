import { Router } from "express";
import { productController } from "../controller/Product/ProductController.js";
import { auth } from "../middleware/auth.js";

export const productRouter = Router();

productRouter.get("/products",  productController.getAllProducts);
productRouter.post("/products", auth, productController.createProduct);
productRouter.put("/products/:id", auth, productController.updateProduct);
productRouter.delete("/products/:id", auth, productController.deleteProduct);
