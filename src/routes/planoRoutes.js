import { Router } from "express";
import { planoController } from "../controller/Plano/PlanoController.js";

const planoRouter = Router();

// /quiz/plano 
planoRouter.get("/plano", planoController.obterPlanoSalvo);

export default planoRouter;