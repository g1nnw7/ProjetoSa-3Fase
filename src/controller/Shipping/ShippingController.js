import axios from 'axios';

const MOCK_ORIGIN_CEP = '01001000'; 
const MOCK_CUSTO_FIXO = 5.00; 
const MOCK_DIAS_UTEIS_PAC = 8;
const MOCK_DIAS_UTEIS_SEDEX = 3;


class ShippingController {

    calculatePackageData(cartItems) {
        let totalWeight = 0;
        let totalValue = 0;
        
        cartItems.forEach(item => {
            totalWeight += (item.weight || 0.5) * item.quantity; 
            totalValue += item.price * item.quantity;
        });

        return {
            peso: Math.max(1, totalWeight), 
            valorDeclarado: totalValue,
            formato: 1, 
            comprimento: 20,
            altura: 10,
            largura: 15,
        };
    }

    async calculateShipping(req, res) {
        const { destinationCep, cartItems } = req.body;
        
        if (!destinationCep || !cartItems || cartItems.length === 0) {
            return res.status(400).json({ error: "CEP de destino e itens do carrinho são obrigatórios." });
        }

        const cleanedCep = destinationCep.replace(/\D/g, '');
        if (cleanedCep.length !== 8) {
            return res.status(400).json({ error: "CEP inválido." });
        }

        const packageData = this.calculatePackageData(cartItems);

        // CÓDIGOS DE SERVIÇO CORREIOS: 04014 (SEDEX), 04510 (PAC)
        const serviceCodes = ['04014', '04510']; 
        const brasilApiUrl = `https://brasilapi.com.br/api/cep/v1/${cleanedCep}`;
        
        try {  
            const results = [
                {
                    service: 'SEDEX',
                    code: '04014',
                    // Cálculo mockado: (Peso * Fator) + Custo Fixo
                    price: (packageData.peso * 5) + MOCK_CUSTO_FIXO,
                    deadline: MOCK_DIAS_UTEIS_SEDEX,
                },
                {
                    service: 'PAC',
                    code: '04510',
                    price: (packageData.peso * 3) + MOCK_CUSTO_FIXO,
                    deadline: MOCK_DIAS_UTEIS_PAC,
                }
            ];

            // Retornando os dados mockados formatados
            const formattedResults = results.map(r => ({
                service: r.service,
                price: parseFloat(r.price),
                deadline: r.deadline,
            })).filter(r => r.price > 0); // Filtra serviços indisponíveis

            return res.status(200).json({ data: formattedResults });


        } catch (error) {
            console.error("Erro ao consultar serviço de frete externo:", error.message);
            return res.status(503).json({ error: "Serviço de frete indisponível no momento." });
        }

    }
}

export const shippingController = new ShippingController();