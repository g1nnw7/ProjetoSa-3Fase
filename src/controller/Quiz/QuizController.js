import { Router } from "express";
import { prismaClient } from '../../../prisma/prisma.js';

class QuizController {
    constructor() { }


async enviarQuiz(req, res) {
    try {
        //  Desestruturação direta
        const { idade, peso, altura, genero, objetivo, usuarioId } = req.body;
        
        // Validação mais robusta 
        if (!idade || !peso || !altura || !genero || !objetivo || !usuarioId) {
            return res.status(400).json({ 
                error: "Campos obrigatórios faltando",
                campos_obrigatorios: ["idade", "peso", "altura", "genero", "objetivo", "usuarioId"]
            });
        }

        // ADICIONADO - Lógica para calcular o plano alimentar
        const tmb = this.calcularTMB(peso, altura, idade, genero);
        const dailyCalories = this.calcularCalorias(tmb, objetivo);
        
        const plano = {
            dailyCalories,
            lunch: this.gerarRefeicao('almoco', objetivo, dailyCalories),
            dinner: this.gerarRefeicao('janta', objetivo, dailyCalories)
        };

        // Salvando dados formatados
        const respostaQuiz = await prismaClient.respostaQuiz.create({
            data: {
                idade: parseInt(idade),
                peso: parseFloat(peso),
                altura: parseFloat(altura),
                genero: genero.toLowerCase(),
                objetivo: objetivo,
                usuarioId: parseInt(usuarioId),
                data_RespostaQuiz: new Date() 
            },
        });

        // CORREÇÃO CRÍTICA - Retorna o PLANO, não mensagem
        return res.status(201).json(plano); // ✅ AGORA RETORNA O PLANO GERADO!

    } catch (error) {
        // tratamento de erro
        console.error('Erro no controller:', error);
        return res.status(500).json({ 
            error: "Erro interno do servidor",
            details: error.message 
        });
    }
}

// ADICIONADO NOVOS MÉTODOS DE CÁLCULO
calcularTMB(peso, altura, idade, genero) {
    // Fórmula de Harris-Benedict para Taxa Metabólica Basal - bagulho loco 
    if (genero === 'masculino') {
        return 88.36 + (13.4 * peso) + (4.8 * altura) - (5.7 * idade);
    } else {
        return 447.6 + (9.2 * peso) + (3.1 * altura) - (4.3 * idade);
    }
}

calcularCalorias(tmb, objetivo) {
    const fatores = {
        'ganho_de_massa_magra': tmb * 1.15,  // +15% para ganho de massa
        'perda_de_peso': tmb * 0.85,         // -15% para perda de peso
        'ganho_de_peso': tmb * 1.1           // +10% para ganho de peso
    };
    return Math.round(fatores[objetivo] || tmb);
}

gerarRefeicao(tipo, objetivo, calorias) {
    const refeicoes = {
        'almoco': {
            'ganho_de_massa_magra': 'Frango grelhado, arroz integral, feijão e legumes',
            'perda_de_peso': 'Salada com frango grelhado e quinoa',
            'ganho_de_peso': 'Macarrão integral com molho de carne e salada'
        },
        'janta': {
            'ganho_de_massa_magra': 'Salmão, batata doce e brócolis',
            'perda_de_peso': 'Omelete de claras com espinafre',
            'ganho_de_peso': 'Peixe assado com purê de batata'
        }
    };
    return refeicoes[tipo][objetivo] || 'Refeição balanceada conforme objetivo';
}
}

export const quizController = new QuizController()