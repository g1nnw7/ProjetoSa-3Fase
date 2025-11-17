import express from "express";
import cors from "cors";
import { usuarioRouter } from "./routes/usuario.js";
import { auth } from "./middleware/auth.js";
import authRouter from "./routes/authRoutes.js";

// NOVAS IMPORTAÇÕES
import { productRouter } from "./routes/product.js";
import { categoryRouter } from "./routes/category.js";

export const app = express();

app.use(cors());
app.use(express.json());

// --- Rotas Públicas ---
app.use("/auth", authRouter);

// Novas rotas públicas da loja (E-commerce)
// (GET /products e GET /categories)
app.use(productRouter);
app.use(categoryRouter);


// --- Middleware global de autenticação ---
// Tudo abaixo daqui exigirá um token válido
app.use(auth)

// --- Rotas Privadas ---
// (GET /usuarios, POST /usuarios, etc.)
app.use(usuarioRouter);