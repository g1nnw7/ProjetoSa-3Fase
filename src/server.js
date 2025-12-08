import { app } from './app.js';
import express from 'express'
import receitasRoutes from './routes/receitas.route.js'
import cors from 'cors'

// const app = express()
const port = process.env.PORT || 3000;

app.use(cors())

app.use(express.json())

app.use('/api/receitas', receitasRoutes)

app.listen(port, () => {
    console.log(`Api rodando na porta ${port}`);
});