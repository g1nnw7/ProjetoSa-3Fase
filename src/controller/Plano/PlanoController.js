import { prismaClient } from '../../../prisma/prisma.js';

class PlanoController {
    constructor() {
        // Inicializa as listas de alimentos no construtor para estarem disponíveis na instância
        this.alimentos = {
            proteinas: ['Frango grelhado', 'Peixe assado (salmão/truta)', 'Carne vermelha magra', 'Ovos (omelete/cozidos)', 'Tofu ou proteína vegetal', 'Lentilhas ou grão-de-bico', 'Peito de peru'],
            carboidratos: ['Arroz integral', 'Batata doce assada', 'Quinoa cozida', 'Aveia em flocos', 'Mandioca cozida', 'Inhame assado', 'Pão integral'],
            vegetais: ['Brócolis no vapor', 'Espinafre refogado', 'Abobrinha grelhada', 'Berinjela assada', 'Cenoura cozida', 'Vagem refogada', 'Salada de folhas verdes'],
            frutas: ['Maçã', 'Banana', 'Laranja', 'Morango', 'Abacate', 'Pera', 'Mamão']
        };

        this.diasAbreviados = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    }

    async obterPlanoSalvo(req, res) {
        try {
            // Assume que o middleware de autenticação (authMiddleware) populou o req.user
            const userId = req.user?.id; 

            if (!userId) {
                return res.status(401).json({ error: "Usuário não autenticado." });
            }

            // 1. Buscar o último resultado de quiz do usuário no banco (Fonte da Verdade)
            const planoBase = await prismaClient.respostaQuiz.findFirst({
                where: { 
                    usuarioId: parseInt(userId) 
                },
                orderBy: {
                    data_RespostaQuiz: 'desc' // Pega o mais recente
                }
            });

            // Se não existir, retornamos erro para o front redirecionar
            if (!planoBase) {
                return res.status(404).json({ 
                    message: "Plano não encontrado. Por favor, realize o quiz primeiro.",
                    redirectTo: "/quiz"
                });
            }

            // 2. Gerar as variações da semana usando método interno
            const variacoesSemanais = this.gerarCardapioSemanal(planoBase.objetivo);

            // 3. Enviar tudo pronto para o front
            return res.json({
                dadosUsuario: planoBase, // Retorna os dados do quiz (peso, altura, objetivo)
                variacoesSemanais: variacoesSemanais // O cardápio gerado
            });

        } catch (error) {
            console.error('Erro no PlanoController:', error);
            return res.status(500).json({ 
                error: "Erro interno do servidor",
                details: error.message 
            });
        }
    }

    // Método auxiliar para gerar o cardápio (Regra de Negócio)
    gerarCardapioSemanal(objetivo) {
        const variacoes = {};

        this.diasAbreviados.forEach((dia, index) => {
            // Acesso aos dados via 'this.alimentos'
            const p = this.alimentos.proteinas[index % this.alimentos.proteinas.length];
            const c = this.alimentos.carboidratos[index % this.alimentos.carboidratos.length];
            const v = this.alimentos.vegetais[index % this.alimentos.vegetais.length];
            const f = this.alimentos.frutas[index % this.alimentos.frutas.length];
            
            // Jantar com proteína diferente (pula 2 índices para variar)
            const p_jantar = this.alimentos.proteinas[(index + 2) % this.alimentos.proteinas.length];

            variacoes[dia] = {
                cafeManha: `2 ovos mexidos com ${v.split(' ')[0]}, 1 fatia de pão integral, 1 ${f}`,
                lancheManha: `1 ${f} com 1 punhado de castanhas`,
                almoco: `200g de ${p}, 100g de ${c}, ${v} à vontade`,
                lancheTarde: objetivo === 'ganho_de_massa_magra' 
                    ? `Shake de proteína com ${f}`
                    : `1 iogurte natural com ${f}`,
                jantar: `150g de ${p_jantar} com legumes`,
                ceia: index % 2 === 0 ? '1 xícara de chá de ervas' : '1 copo de leite vegetal'
            };
        });

        return variacoes;
    }
}

// Exportação da instância (Singleton pattern simples)
export const planoController = new PlanoController();