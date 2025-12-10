import { Router } from "express";
import { quizController } from "../controller/Quiz/QuizController.js";

const quizRouter = Router();

// /quiz
// usei (req, res) => ... para garantir que o 'this' funcione dentro do controller
quizRouter.post("/", (req, res) => quizController.enviarQuiz(req, res));

export default quizRouter;