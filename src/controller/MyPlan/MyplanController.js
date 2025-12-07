// src/controller/MyPlan/MyPlanController.js

import { prismaClient } from '../../../prisma/prisma.js';

class MyPlanController {
    constructor() {
        // Se precisar de configurações iniciais, coloque aqui
    }

    // LISTAR HISTÓRICO
    async obterHistorico(req, res) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ error: "Usuário não autenticado." });
            }

            // Busca planos ordenados por data (mais recente primeiro)
            // EQUIVALENTE PRISMA: findMany com orderBy
            const historico = await prismaClient.respostaQuiz.findMany({
                where: { 
                    usuarioId: parseInt(userId) 
                },
                orderBy: { 
                    data_RespostaQuiz: 'desc' 
                }
            });

            return res.json(historico);

        } catch (error) {
            console.error("Erro ao buscar histórico:", error);
            return res.status(500).json({ error: 'Erro ao buscar histórico' });
        }
    }

    // LIMPAR HISTÓRICO
    async limparHistorico(req, res) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ error: "Usuário não autenticado." });
            }

            // Deleta todos os planos daquele usuário
            // EQUIVALENTE PRISMA: deleteMany
            await prismaClient.respostaQuiz.deleteMany({
                where: { 
                    usuarioId: parseInt(userId) 
                }
            });

            return res.json({ message: 'Histórico limpo com sucesso' });

        } catch (error) {
            console.error("Erro ao limpar histórico:", error);
            return res.status(500).json({ error: 'Erro ao limpar histórico' });
        }
    }

    // DEFINIR PLANO ATIVO
    async definirPlanoAtivo(req, res) {
        try {
            const userId = req.user?.id;
            const { planoId } = req.body;

            if (!planoId || !userId) {
                return res.status(400).json({ error: "Dados insuficientes." });
            }

            // Precisamos garantir que o plano pertence ao usuário antes de atualizar
            const planoExistente = await prismaClient.respostaQuiz.findFirst({
                where: {
                    id: parseInt(planoId),
                    usuarioId: parseInt(userId)
                }
            });

            if (!planoExistente) {
                return res.status(404).json({ error: 'Plano não encontrado ou não pertence a você.' });
            }

            // Atualiza a data para agora, fazendo ele ser o "primeiro" na busca sorted
            // EQUIVALENTE PRISMA: update
            const planoAtualizado = await prismaClient.respostaQuiz.update({
                where: { 
                    id: parseInt(planoId) 
                },
                data: { 
                    data_RespostaQuiz: new Date() // "Ressuscita" o plano para o topo
                }
            });

            return res.json(planoAtualizado);

        } catch (error) {
            console.error("Erro ao definir plano ativo:", error);
            return res.status(500).json({ error: 'Erro ao definir plano ativo' });
        }
    }
}

// Exportação da instância
export const myPlanController = new MyPlanController();