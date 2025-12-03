import { prismaClient } from "../../../prisma/prisma.js";

class OrderController {

    async getMyOrders(req, res) {
        try {
            const userId = req.auth?.id || req.auth?.userId;
            if (!userId) return res.status(401).json({ error: "Não autorizado." });

            const orders = await prismaClient.pedido.findMany({
                where: { userId: userId },
                include: {
                    items: {
                        include: {
                            product: { select: { nome: true, imageUrl: true } }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            return res.json({ data: orders });

        } catch (error) {
            console.error("Erro ao buscar pedidos:", error);
            return res.status(500).json({ error: "Erro interno." });
        }
    }
}

export const orderController = new OrderController();