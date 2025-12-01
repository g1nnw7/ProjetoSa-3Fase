import 'dotenv/config';
import express from "express";
import cors from "cors";
import { usuarioRouter } from "./routes/usuario.js";
import { productRouter } from "./routes/product.js";
import { categoryRouter } from "./routes/category.js";
import { auth } from "./middleware/auth.js";
import authRouter from "./routes/authRoutes.js";
import shippingRouter from "./routes/shippingRoutes.js";
import addressRouter from "./routes/adressRoutes.js";
import alimentoRouter from "./routes/alimentos.js";
import paymentRouter from "./routes/paymentRoutes.js";

export const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);
app.use(productRouter);  
app.use(categoryRouter); 
app.use("/shipping", shippingRouter); 
app.use("/alimentos", alimentoRouter); 
app.use(auth);

// ROTAS PRIVADAS (Com Login)

app.use(usuarioRouter); 

app.use("/enderecos", addressRouter);

app.use("/payment", paymentRouter);