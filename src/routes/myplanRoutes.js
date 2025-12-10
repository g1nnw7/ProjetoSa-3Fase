import { Router } from "express";
import { myPlanController } from "../controller/MyPlan/MyplanController.js";


const myPlanRouter = Router();

// As rotas abaixo são prefixadas por "/dashboard" conforme definido no app.js

// Rota final: GET http://localhost:3000/dashboard/myplan
myPlanRouter.get("/myplan", myPlanController.obterHistorico);

// Rota final: DELETE http://localhost:3000/dashboard/historico
myPlanRouter.delete("/historico", myPlanController.limparHistorico);

// Rota final: PATCH http://localhost:3000/dashboard/definir-ativo
myPlanRouter.patch("/definir-ativo", myPlanController.definirPlanoAtivo);

export default myPlanRouter;