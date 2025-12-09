import { Router } from "express";
import { myPlanController } from "../controller/MyPlan/MyplanController.js";

const myplanRouter = Router();

// /api/dashboard/myplan
myplanRouter.get("/myplan", myPlanController.obterHistorico);

// /api/dashboard/historico
myplanRouter.delete("/historico", myPlanController.limparHistorico);

// /api/dashboard/definir-ativo
// define o plano atual, marca e coloca no topo
myplanRouter.patch("/definir-ativo", myPlanController.definirPlanoAtivo);

export default myplanRouter;