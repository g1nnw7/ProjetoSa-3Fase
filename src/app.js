import express from "express";
import cors from "cors";
import { usuarioRouter } from "./routes/usuario.js";
import { auth } from "./middleware/auth.js";
import authRouter from "./routes/authRoutes.js";
import { productRouter } from "./routes/product.js";
import { categoryRouter } from "./routes/category.js";

export const app = express();

app.use(cors());
app.use(express.json());

// --- Rotas Públicas ---
app.use("/auth", authRouter);

app.use(productRouter);
app.use(categoryRouter);


// --- Middleware global de autenticação ---
app.use(auth)

// --- Rotas Privadas ---

app.use(usuarioRouter);