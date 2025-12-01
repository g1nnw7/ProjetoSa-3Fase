import { MercadoPagoConfig, Preference } from 'mercadopago';
import { prismaClient } from "../../../prisma/prisma.js";

// 1. Definir o Token
const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || 'APP_USR-6000377020533839-120118-881a9915cce1a36b2cefa4701023f460-3021017049';

// 2. Configurar o Cliente MP
const client = new MercadoPagoConfig({ 
    accessToken: ACCESS_TOKEN
});

class PaymentController {
    
    async createPreference(req, res) {
        try {
            console.log("--- INICIANDO PAGAMENTO ---");
            if (!ACCESS_TOKEN) {
                return res.status(500).json({ error: "Token de pagamento não configurado." });
            }

            const { items } = req.body;
            const userId = req.auth?.id || req.auth?.userId;

            if (!items || items.length === 0) {
                return res.status(400).json({ error: "Carrinho vazio." });
            }

            const user = await prismaClient.usuario.findUnique({ where: { id: userId } });
            if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

            // 3. Formatar itens
            const mpItems = items.map(item => {
                const cleanImg = item.imageUrl && item.imageUrl.startsWith('http') 
                    ? item.imageUrl 
                    : 'https://www.nutrifit.com.br/logo-placeholder.png';

                return {
                    id: String(item.id),
                    title: item.nome,
                    description: item.descricao ? item.descricao.substring(0, 200) : item.nome,
                    picture_url: cleanImg, 
                    quantity: Number(item.quantity),
                    unit_price: Number(item.preco),
                    currency_id: 'BRL'
                };
            });

            // 4. Criar a Preferência
            const preference = new Preference(client);
            
            const body = {
                items: mpItems,
                payer: {
                    name: user.nome.split(" ")[0],
                    surname: user.nome.split(" ").slice(1).join(" ") || "Cliente",
                    email: user.email,
                },
                back_urls: {
                    "success": "http://localhost:5173/dashboard",
                    "failure": "http://localhost:5173/checkout",
                    "pending": "http://localhost:5173/checkout"
                },
                // CORREÇÃO: Comentei o auto_return para evitar o erro de validação de URL em localhost
                // auto_return: "approved", 
                statement_descriptor: "NUTRIFIT",
                external_reference: String(Date.now())
            };

            console.log("Enviando preferência para MP...", body);
            
            const result = await preference.create({ body });

            console.log("SUCESSO! ID da Preferência:", result.id);

            return res.status(200).json({ 
                id: result.id, 
                init_point: result.init_point, 
                sandbox_init_point: result.sandbox_init_point 
            });

        } catch (error) {
            console.error("ERRO CRÍTICO NO MERCADO PAGO:");
            if (error.cause) {
                 console.error("Causa:", JSON.stringify(error.cause, null, 2));
            } else {
                 console.error(error);
            }

            return res.status(500).json({ 
                error: "Erro ao criar pagamento.",
                details: error.message 
            });
        }
    }
}

export const paymentController = new PaymentController();