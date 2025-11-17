import { Router } from "express";
import { categoryController } from "../controller/Categoria/CategoryController.js";

export const categoryRouter = Router();

// Rota pública para listar todas as categorias
categoryRouter.get("/categories", categoryController.getAllCategories);