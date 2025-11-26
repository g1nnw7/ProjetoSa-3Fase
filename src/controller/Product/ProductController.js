import { prismaClient } from "../../../prisma/prisma.js";

class ProductController {
  async getAllProducts(req, res) {
    try {
      const { category, search, sort } = req.query;
      let where = {};
      let orderBy = {};

      if (category && category !== 'all') {
        where.category = { slug: String(category) };
      }

      if (search) {
        where.nome = {
          contains: String(search),
          mode: 'insensitive',
        };
      }
      
      if (sort === 'price_asc') orderBy = { preco: 'asc' };
      else if (sort === 'price_desc') orderBy = { preco: 'desc' };
      else orderBy = { nome: 'asc' };

      const products = await prismaClient.product.findMany({
        where,
        orderBy,
        include: {
          category: {
            select: { nome: true, slug: true }
          }
        },
      });

      return res.status(200).json(products);

    } catch (e) {
      console.error("Erro em getAllProducts:", e);
      return res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  }


  async createProduct(req, res) {
    try {
      const { nome, descricao, preco, imageUrl, categorySlug } = req.body;

      if (!nome || !preco || !categorySlug) {
        return res.status(400).json({ error: "Dados obrigatórios faltando." });
      }

      const category = await prismaClient.category.findUnique({
        where: { slug: categorySlug }
      });

      if (!category) {
         return res.status(400).json({ error: "Categoria inválida." });
      }

      const slug = nome.toLowerCase().replace(/ /g, '-') + '-' + Date.now();

      const newProduct = await prismaClient.product.create({
        data: {
          nome,
          slug,
          descricao,
          preco: parseFloat(preco),
          imageUrl,
          category: { connect: { slug: categorySlug } }
        }
      });

      return res.status(201).json(newProduct);

    } catch (error) {
      console.error("Erro ao criar produto:", error);
      return res.status(500).json({ error: "Erro ao criar produto" });
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { nome, descricao, preco, imageUrl, categorySlug } = req.body;

      let dataToUpdate = {
        nome,
        descricao,
        preco: parseFloat(preco),
        imageUrl
      };
      if (categorySlug) {
        dataToUpdate.category = { connect: { slug: categorySlug } };
      }

      const updatedProduct = await prismaClient.product.update({
        where: { id: id },
        data: dataToUpdate
      });

      return res.status(200).json(updatedProduct);

    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      if (error.code === 'P2025') {
          return res.status(404).json({ error: "Produto não encontrado." });
      }
      return res.status(500).json({ error: "Erro ao atualizar produto" });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      await prismaClient.product.delete({
        where: { id: id }
      });

      return res.status(200).json({ message: "Produto deletado com sucesso." });

    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      if (error.code === 'P2025') {
          return res.status(404).json({ error: "Produto não encontrado." });
      }
      return res.status(500).json({ error: "Erro ao deletar produto" });
    }
  }
}

export const productController = new ProductController();