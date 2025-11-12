import express from "express";
import cors from "cors";
import { usuarioRouter } from "./routes/usuario.js";
import { auth } from "./middleware/auth.js";
import authRouter from "./routes/authRoutes.js";

export const app = express();

app.use(cors());
app.use(express.json());

// Rotas públicas
app.use("/auth", authRouter);

// Middleware global de autenticação
app.use(auth)

// Rotas privadas
app.use(usuarioRouter);
