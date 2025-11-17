import { prismaClient } from "../../../prisma/prisma.js";

class CategoryController {
  

  async getAllCategories(req, res) {
    try {
      const categories = await prismaClient.category.findMany({
        select: {
          id: true,
          nome: true,
          slug: true,
        },
      });
      return res.status(200).json(categories);
    } catch (e) {
      console.error("Erro em getAllCategories:", e);
      return res.status(500).json({ error: "Erro ao buscar categorias" });
    }
  }

}

export const categoryController = new CategoryController();