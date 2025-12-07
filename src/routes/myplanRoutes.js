import { Router } from "express";
import { myPlanController } from "../controller/MyPlan/MyplanController.js";

const myplanRouter = Router();

// /api/dashboard/historico-plano
myplanRouter.get("/myplan", myPlanController.obterHistorico);

// /api/dashboard/historico-plano
myplanRouter.delete("/myplan", myPlanController.limparHistorico);

// /api/dashboard/definir-ativo
// define o plano atual, marca e coloca no topo
myplanRouter.patch("/myplan", myPlanController.definirPlanoAtivo);

export default myplanRouter;