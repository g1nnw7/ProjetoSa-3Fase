import { prismaClient } from "../../../prisma/prisma.js";

class AlimentoController {
  
  // GET /alimentos - Lista todos os alimentos para o select/busca
  async getAllAlimentos(req, res) {
    try {
      const alimentos = await prismaClient.alimento.findMany({
        orderBy: { nome: 'asc' }
      });
      return res.json(alimentos);
    } catch (error) {
      console.error("Erro ao buscar alimentos:", error);
      return res.status(500).json({ error: "Erro ao buscar alimentos" });
    }
  }

  // POST /alimentos - (Opcional) Para cadastrar novos via API
  async createAlimento(req, res) {
    try {
      const { nome, gramas, calorias, proteinas, carboidratos, gorduras } = req.body;
      const novoAlimento = await prismaClient.alimento.create({
        data: { nome, gramas, calorias, proteinas, carboidratos, gorduras }
      });
      return res.status(201).json(novoAlimento);
    } catch (error) {
        console.error("Erro ao criar alimento:", error);
        return res.status(500).json({ error: "Erro ao criar alimento" });
    }
  }
}

export const alimentoController = new AlimentoController();