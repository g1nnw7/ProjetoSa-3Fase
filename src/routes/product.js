import { Router } from "express";
import { productController } from "../controller/Product/ProductController.js";

export const productRouter = Router();

// Rota pública para listar/filtrar todos os produtos
productRouter.get("/products", productController.getAllProducts);