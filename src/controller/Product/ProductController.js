import { prismaClient } from "../../../prisma/prisma.js";

class ProductController {

  /**
   * GET /products
   * Rota principal da loja.
   * Aceita query params:
   * - ?category=slug-da-categoria
   * - ?search=termo-de-busca
   * - ?sort=price_asc | price_desc
   */
  async getAllProducts(req, res) {
    try {
      const { category, search, sort } = req.query;

      let where = {};
      let orderBy = {};

      // 1. Filtro de Categoria (por slug)
      if (category) {
        where.category = { slug: String(category) };
      }

      // 2. Filtro de Busca por Nome (case-insensitive)
      if (search) {
        where.nome = {
          contains: String(search),
          mode: 'insensitive',
        };
      }
      
      // 3. Ordenação
      if (sort === 'price_asc') {
        orderBy = { preco: 'asc' };
      } else if (sort === 'price_desc') {
        orderBy = { preco: 'desc' };
      } else {
        // Ordenação padrão (ex: por nome)
        orderBy = { nome: 'asc' };
      }

      const products = await prismaClient.product.findMany({
        where,
        orderBy,
        include: {
          // Inclui os dados da categoria junto com o produto
          category: {
            select: {
              nome: true,
              slug: true,
            }
          }
        },
      });

      return res.status(200).json(products);

    } catch (e) {
      console.error("Erro em getAllProducts:", e);
      return res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  }

  // (No futuro, você pode adicionar create, update, delete aqui para admin)
}

export const productController = new ProductController();