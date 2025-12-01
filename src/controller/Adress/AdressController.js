import { prismaClient } from "../../../prisma/prisma.js";

// Função auxiliar (fora da classe para evitar erros de 'this')
const getUserId = (req) => {
  return req.auth?.id || req.auth?.userId; 
};

class AddressController {
  
  // GET /enderecos
  async getAddresses(req, res) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ error: "Não autorizado." });

      const addresses = await prismaClient.endereco.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' }
      });

      return res.status(200).json({ data: addresses });
    } catch (error) {
      console.error("Erro ao listar endereços:", error);
      return res.status(500).json({ error: "Erro interno ao buscar endereços." });
    }
  }

  // POST /enderecos
  async addAddress(req, res) {
    try {
      const userId = getUserId(req);
      if (!userId) return res.status(401).json({ error: "Não autorizado." });

      const addressData = req.body;
      
      // Remove o ID para não conflitar
      delete addressData.id; 

      const newAddress = await prismaClient.endereco.create({
        data: {
          ...addressData,
          userId: userId, 
        },
      });

      return res.status(201).json({ message: "Endereço criado!", data: newAddress });
    } catch (error) {
      console.error("Erro ao criar endereço:", error);
      return res.status(500).json({ error: "Erro interno ao criar endereço." });
    }
  }

  // PUT /enderecos/:id
  async updateAddress(req, res) {
    try {
      const userId = getUserId(req);
      const { id } = req.params;
      const addressData = req.body;

      if (!userId) return res.status(401).json({ error: "Não autorizado." });

      const existingAddress = await prismaClient.endereco.findUnique({
        where: { id: Number(id) }
      });

      if (!existingAddress || existingAddress.userId !== userId) {
        return res.status(403).json({ error: "Acesso negado." });
      }

      // Limpeza de campos que não devem ser alterados
      delete addressData.id;
      delete addressData.userId;
      delete addressData.createdAt;

      const updatedAddress = await prismaClient.endereco.update({
        where: { id: Number(id) },
        data: addressData,
      });

      return res.status(200).json({ message: "Atualizado com sucesso!", data: updatedAddress });

    } catch (error) {
      console.error("Erro ao atualizar endereço:", error);
      return res.status(500).json({ error: "Erro interno ao atualizar." });
    }
  }

  // DELETE /enderecos/:id
  async deleteAddress(req, res) {
    try {
      const userId = getUserId(req);
      const { id } = req.params;

      if (!userId) return res.status(401).json({ error: "Não autorizado." });

      const existingAddress = await prismaClient.endereco.findUnique({
        where: { id: Number(id) }
      });

      if (!existingAddress || existingAddress.userId !== userId) {
        return res.status(403).json({ error: "Acesso negado." });
      }

      await prismaClient.endereco.delete({
        where: { id: Number(id) }
      });

      return res.status(200).json({ message: "Endereço removido." });

    } catch (error) {
      console.error("Erro ao deletar endereço:", error);
      return res.status(500).json({ error: "Erro interno ao deletar." });
    }
  }
}

export const addressController = new AddressController();