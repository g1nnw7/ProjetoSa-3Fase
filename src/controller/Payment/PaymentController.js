import { MercadoPagoConfig, Preference } from 'mercadopago';
import { prismaClient } from "../../../prisma/prisma.js";

// Configuração do Token (Com Fallback para teste)
const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || 'APP_USR-6000377020533839-120118-881a9915cce1a36b2cefa4701023f460-3021017049';

const client = new MercadoPagoConfig({ 
    accessToken: ACCESS_TOKEN
});

class PaymentController {
    
    async createPreference(req, res) {
        try {
            console.log("--- INICIANDO CRIAÇÃO DE PREFERÊNCIA ---");
            
            if (!ACCESS_TOKEN) {
                throw new Error("Token do Mercado Pago não configurado.");
            }

            const { items, addressId, shippingCost = 0, discount = 0 } = req.body;
            const userId = req.auth?.id || req.auth?.userId;

            // Validações Iniciais
            if (!items || items.length === 0) {
                return res.status(400).json({ error: "Carrinho vazio." });
            }

            const user = await prismaClient.usuario.findUnique({ where: { id: userId } });
            if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

            // --- CÁLCULO DE VALORES ---
            // Garante que tudo é número para evitar erros de NaN
            const totalProductsValue = items.reduce((acc, item) => acc + (Number(item.preco) * Number(item.quantity)), 0);
            const discountValue = Number(discount);
            const shippingValue = Number(shippingCost);

            // Fator de desconto (evita divisão por zero)
            let discountFactor = 1;
            if (discountValue > 0 && totalProductsValue > 0) {
                discountFactor = (totalProductsValue - discountValue) / totalProductsValue;
                // Proteção: Se o desconto for maior que o total, cobra R$ 0.01 simbólico ou zera (mas MP não aceita 0 em unit_price)
                if (discountFactor < 0) discountFactor = 0; 
            }

            // --- FORMATAÇÃO DOS ITENS (CRÍTICO PARA O MP) ---
            const mpItems = items.map(item => {
                const originalPrice = Number(item.preco);
                let finalPrice = originalPrice * discountFactor;

                // CORREÇÃO IMPORTANTE: O Mercado Pago rejeita unit_price = 0
                // Se o desconto zerar o item, forçamos um valor mínimo ou tratamos como brinde (mas MP exige valor)
                if (finalPrice <= 0) finalPrice = 0.01;

                // URL da imagem segura
                const cleanImg = item.imageUrl && item.imageUrl.startsWith('http') 
                    ? item.imageUrl 
                    : 'https://www.nutrifit.com.br/logo-placeholder.png';

                return {
                    id: String(item.id),
                    title: item.nome,
                    description: item.descricao ? item.descricao.substring(0, 200) : item.nome,
                    picture_url: cleanImg,
                    quantity: parseInt(item.quantity), // MP exige Inteiro
                    unit_price: parseFloat(finalPrice.toFixed(2)), // MP exige Número com 2 casas
                    currency_id: 'BRL'
                };
            });

            // --- CRIAÇÃO DA PREFERÊNCIA ---
            const preference = new Preference(client);
            
            const body = {
                items: mpItems,
                // Envio do frete (shipments)
                shipments: {
                    cost: shippingValue,
                    mode: 'not_specified',
                },
                payer: {
                    name: user.nome.split(" ")[0], // Primeiro nome
                    surname: user.nome.split(" ").slice(1).join(" ") || "Cliente", // Sobrenome
                    email: user.email,
                },
                back_urls: {
                    success: "http://localhost:5173/dashboard",
                    failure: "http://localhost:5173/checkout",
                    pending: "http://localhost:5173/checkout"
                },
                // auto_return: "approved", // Desativado para evitar erros locais
                statement_descriptor: "NUTRIFIT",
                external_reference: `ORDER-${Date.now()}-${userId}`
            };

            console.log("Enviando Body para MP:", JSON.stringify(body, null, 2));

            const result = await preference.create({ body });

            console.log("SUCESSO! Init Point:", result.init_point);

            return res.status(200).json({ 
                id: result.id, 
                init_point: result.init_point, 
                sandbox_init_point: result.sandbox_init_point 
            });

        } catch (error) {
            console.error("ERRO NO PAGAMENTO:");
            console.error(error); // Erro cru
            
            // Tenta extrair detalhes da API do Mercado Pago
            if (error.cause) {
                console.error("Detalhes da Causa MP:", JSON.stringify(error.cause, null, 2));
            }
            return res.status(500).json({ 
                error: "Erro ao criar pagamento.",
                details: error.message 
            });
        }
    }
}

export const paymentController = new PaymentController();