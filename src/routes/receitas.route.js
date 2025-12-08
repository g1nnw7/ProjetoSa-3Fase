import express from 'express'
import { perguntarReceita } from '../controller/Receitas/receitas.controller.js'

const router = express.Router()

router.post('/perguntar', perguntarReceita)

export default router;