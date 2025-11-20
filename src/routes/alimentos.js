import { Router } from "express";
import { alimentoController } from "../controller/Alimentos/AlimentosController.js";


const alimentoRouter = Router();

alimentoRouter.get("/", alimentoController.getAllAlimentos);
alimentoRouter.post("/", alimentoController.createAlimento);

export default alimentoRouter;