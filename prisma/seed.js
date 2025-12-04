import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// --- DADOS DA LOJA (CATEGORIAS) ---
const categoriesData = [
  { nome: 'Whey Protein', slug: 'whey-protein' },
  { nome: 'Creatina', slug: 'creatina' },
  { nome: 'Pré Treino', slug: 'pre-treino' },
  { nome: 'Acessórios', slug: 'acessorios' },
  { nome: 'Moda', slug: 'moda' },
];

// --- DADOS DA LOJA (PRODUTOS) ---
// CORREÇÃO: Removido 'public' do início dos caminhos das imagens
const productsData = [
  // --- Whey Protein ---
  {
    nome: 'Whey 100% Concentrado (900g)',
    slug: 'whey-100-concentrado-900g',
    descricao: 'Proteína concentrada do soro do leite de alta qualidade, ideal para ganho de massa muscular. Sabor baunilha.',
    preco: 129.90,
    imageUrl: '/img/wheyConcentreado900g.png', // <--- CORRIGIDO
    estoque: 50,
    proteinas: 25,
    isGlutenFree: true,
    categorySlug: 'whey-protein',
  },
  {
    nome: 'Whey Isolado Zero Carb (900g)',
    slug: 'whey-isolado-zero-carb-900g',
    descricao: 'Proteína isolada de rápida absorção, sem carboidratos e sem lactose. Sabor chocolate.',
    preco: 189.90,
    imageUrl: 'public/img/wheyIsolado900g.png',
    estoque: 30,
    proteinas: 28,
    isLactoseFree: true,
    categorySlug: 'whey-protein',
  },

  // --- Creatina ---
  {
    nome: 'Creatina Monohidratada Pura (250g)',
    slug: 'creatina-monohidratada-250g',
    descricao: 'Aumente sua força e explosão nos treinos com a creatina monohidratada 100% pura.',
    preco: 89.90,
    imageUrl: '/img/creatina-monohidratada.png', // <--- CORRIGIDO
    estoque: 100,
    isVegano: true,
    categorySlug: 'creatina',
  },
  {
    nome: 'Creatina Micronizada (150g)',
    slug: 'creatina-micronizada-150g',
    descricao: 'Fácil diluição e absorção otimizada. A creatina micronizada leva seus treinos a outro nível.',
    preco: 69.90,
    imageUrl: '/img/creatina-micronizada.png', // <--- CORRIGIDO
    estoque: 70,
    categorySlug: 'creatina',
  },

  // --- Pré Treino ---
  {
    nome: 'Pré Treino "Égide" (Sabor Frutas Vermelhas)',
    slug: 'pre-treino-egide-frutas',
    descricao: 'Foco, energia e vasodilatação. Prepare-se para treinos mais intensos.',
    preco: 119.90,
    imageUrl: '/img/pre-frutas-vermelhas.png', // <--- CORRIGIDO
    estoque: 40,
    calorias: 5,
    categorySlug: 'pre-treino',
  },
  {
    nome: 'Pré Treino "Hórus" (Sabor Maçã Verde)',
    slug: 'pre-treino-horus-maca',
    descricao: 'A fórmula Hórus foi desenvolvida para quem busca performance extrema. Contém cafeína e beta-alanina.',
    preco: 109.90,
    imageUrl: '/img/pre-treino.png', // <--- CORRIGIDO
    estoque: 35,
    calorias: 10,
    categorySlug: 'pre-treino',
  },

  // --- Acessórios ---
  {
    nome: 'Coqueteleira (600ml) - Preta',
    slug: 'coqueteleira-600ml-preta',
    descricao: 'Praticidade para misturar seus suplementos. Com marcações de ML e mola misturadora.',
    preco: 29.90,
    imageUrl: '/img/coqueteleira.png', // <--- CORRIGIDO
    estoque: 200,
    categorySlug: 'acessorios',
  },
  {
    nome: 'Galão de Água (2L) - Rosa',
    slug: 'galao-agua-2l-rosa',
    descricao: 'Mantenha-se hidratado durante todo o dia com estilo. Plástico resistente e livre de BPA.',
    preco: 45.00,
    imageUrl: '/img/galao.png', // <--- CORRIGIDO
    estoque: 80,
    categorySlug: 'acessorios',
  },

  // --- Moda ---
  {
    nome: 'Camiseta Dry Fit (Preta)',
    slug: 'camiseta-dry-fit-preta',
    descricao: 'Conforto e tecnologia para seus treinos. Tecido leve que absorve o suor.',
    preco: 79.90,
    imageUrl: '/img/camiseta.png', // <--- CORRIGIDO
    estoque: 50,
    categorySlug: 'moda',
  },
  {
    nome: 'Legging de Treino (Grafite)',
    slug: 'legging-treino-grafite',
    descricao: 'Alta compressão e zero transparência. Perfeita para agachamentos e corridas.',
    preco: 119.90,
    imageUrl: '/img/leggin.png', // <--- CORRIGIDO
    estoque: 40,
    categorySlug: 'moda',
  },
];

// --- DADOS DA CALCULADORA (ALIMENTOS) ---
const alimentosData = [
  { nome: 'Arroz integral', gramas: 100, calorias: 130, proteinas: 2.6, carboidratos: 28, gorduras: 1.0 },
  { nome: 'Feijão carioca', gramas: 100, calorias: 76, proteinas: 5.0, carboidratos: 13, gorduras: 0.6 },
  { nome: 'Peito de frango grelhado', gramas: 100, calorias: 165, proteinas: 31, carboidratos: 0, gorduras: 3.6 },
  { nome: 'Salmão grelhado', gramas: 100, calorias: 208, proteinas: 20, carboidratos: 0, gorduras: 13.4 },
  { nome: 'Ovo cozido', gramas: 50, calorias: 78, proteinas: 6.3, carboidratos: 0.6, gorduras: 5.3 },
  { nome: 'Banana prata', gramas: 100, calorias: 89, proteinas: 1.1, carboidratos: 23, gorduras: 0.3 },
  { nome: 'Arroz branco', gramas: 100, calorias: 130, proteinas: 2.5, carboidratos: 28, gorduras: 0.2 },
  { nome: 'Feijão preto', gramas: 100, calorias: 140, proteinas: 9, carboidratos: 23, gorduras: 1.0 },
  { nome: 'Macarrão', gramas: 100, calorias: 150, proteinas: 5, carboidratos: 30, gorduras: 0.6 },
  { nome: 'Pão francês', gramas: 100, calorias: 270, proteinas: 8, carboidratos: 50, gorduras: 1.5 },
  { nome: 'Leite integral', gramas: 100, calorias: 61, proteinas: 3.3, carboidratos: 4.9, gorduras: 3.5 },
  { nome: 'Manteiga', gramas: 100, calorias: 720, proteinas: 0, carboidratos: 0, gorduras: 81 },
  { nome: 'Queijo muçarela', gramas: 100, calorias: 320, proteinas: 22, carboidratos: 1, gorduras: 26 },
  { nome: 'Presunto', gramas: 100, calorias: 130, proteinas: 16, carboidratos: 2, gorduras: 5 },
  { nome: 'Ovo frito', gramas: 100, calorias: 190, proteinas: 12, carboidratos: 1, gorduras: 15 },
  { nome: 'Café com açúcar', gramas: 100, calorias: 25, proteinas: 0, carboidratos: 6, gorduras: 0 },
  { nome: 'Refrigerante', gramas: 100, calorias: 42, proteinas: 0, carboidratos: 11, gorduras: 0 },
  { nome: 'Biscoito recheado', gramas: 100, calorias: 470, proteinas: 6, carboidratos: 70, gorduras: 21 },
  { nome: 'Frango grelhado', gramas: 100, calorias: 165, proteinas: 31, carboidratos: 0, gorduras: 3 },
  { nome: 'Batata doce', gramas: 100, calorias: 86, proteinas: 1.6, carboidratos: 20, gorduras: 0.2 },
  { nome: 'Brócolis cozido', gramas: 100, calorias: 35, proteinas: 2.8, carboidratos: 7, gorduras: 0.3 },
  { nome: 'Azeite de oliva', gramas: 100, calorias: 880, proteinas: 0, carboidratos: 0, gorduras: 100 },
  { nome: 'Pão integral', gramas: 100, calorias: 250, proteinas: 8, carboidratos: 40, gorduras: 2 },
  { nome: 'Banana', gramas: 100, calorias: 89, proteinas: 1.1, carboidratos: 23, gorduras: 0.3 },
  { nome: 'Aveia em flocos', gramas: 100, calorias: 380, proteinas: 13, carboidratos: 67, gorduras: 7 },
  { nome: 'Peito de peru', gramas: 100, calorias: 104, proteinas: 22, carboidratos: 0.2, gorduras: 2 },
  { nome: 'Iogurte natural', gramas: 100, calorias: 61, proteinas: 3.5, carboidratos: 4.7, gorduras: 3.4 },
  { nome: 'Leite desnatado', gramas: 100, calorias: 35, proteinas: 3.2, carboidratos: 5, gorduras: 1 },
  { nome: 'Tilápia grelhada', gramas: 100, calorias: 130, proteinas: 26, carboidratos: 0, gorduras: 1.5 },
  { nome: 'Quinoa cozida', gramas: 100, calorias: 120, proteinas: 4.3, carboidratos: 21, gorduras: 1.9 },
  { nome: 'Tofu', gramas: 100, calorias: 76, proteinas: 8.2, carboidratos: 1.5, gorduras: 4.8 },
  { nome: 'Abacate', gramas: 100, calorias: 160, proteinas: 2, carboidratos: 9, gorduras: 15 },
  { nome: 'Maçã', gramas: 100, calorias: 52, proteinas: 0.3, carboidratos: 14, gorduras: 0.2 },
  { nome: 'Cenoura crua', gramas: 100, calorias: 41, proteinas: 0.9, carboidratos: 10, gorduras: 0.2 },
  { nome: 'Abobrinha cozida', gramas: 100, calorias: 17, proteinas: 1.2, carboidratos: 3, gorduras: 0.1 },
  { nome: 'Tomate', gramas: 100, calorias: 18, proteinas: 0.9, carboidratos: 3.9, gorduras: 0.2 },
  { nome: 'Couve refogada', gramas: 100, calorias: 33, proteinas: 2.9, carboidratos: 6.2, gorduras: 0.3 },
  { nome: 'Granola', gramas: 100, calorias: 470, proteinas: 8, carboidratos: 64, gorduras: 12 },
  { nome: 'Amêndoas', gramas: 100, calorias: 580, proteinas: 21, carboidratos: 22, gorduras: 49 },
  { nome: 'Castanha de caju', gramas: 100, calorias: 560, proteinas: 15, carboidratos: 30, gorduras: 43 },
  { nome: 'Nozes', gramas: 100, calorias: 650, proteinas: 15, carboidratos: 14, gorduras: 65 },
  { nome: 'Leite de soja', gramas: 100, calorias: 33, proteinas: 3.1, carboidratos: 3.4, gorduras: 1.9 },
  { nome: 'Whey protein', gramas: 100, calorias: 400, proteinas: 80, carboidratos: 8, gorduras: 5 },
  { nome: 'Batata inglesa', gramas: 100, calorias: 77, proteinas: 1.9, carboidratos: 17, gorduras: 0.2 },
  { nome: 'Mandioca cozida', gramas: 100, calorias: 120, proteinas: 0.5, carboidratos: 28, gorduras: 0.3 },
  { nome: 'Cuscuz', gramas: 100, calorias: 110, proteinas: 3, carboidratos: 23, gorduras: 1 },
  { nome: 'Repolho cru', gramas: 100, calorias: 25, proteinas: 1.2, carboidratos: 6, gorduras: 0.1 },
  { nome: 'Morango', gramas: 100, calorias: 32, proteinas: 0.7, carboidratos: 8, gorduras: 0.3 },
  { nome: 'Melancia', gramas: 100, calorias: 30, proteinas: 0.6, carboidratos: 8, gorduras: 0.2 },
  { nome: 'Pera', gramas: 100, calorias: 57, proteinas: 0.4, carboidratos: 15, gorduras: 0.1 },
  { nome: 'Uva', gramas: 100, calorias: 69, proteinas: 0.7, carboidratos: 18, gorduras: 0.1 },
  { nome: 'Ervilha cozida', gramas: 100, calorias: 84, proteinas: 5.4, carboidratos: 14, gorduras: 0.4 },
  { nome: 'Grão-de-bico', gramas: 100, calorias: 160, proteinas: 9, carboidratos: 27, gorduras: 3 },
  { nome: 'Lentilha cozida', gramas: 100, calorias: 116, proteinas: 9, carboidratos: 20, gorduras: 0.4 },
  { nome: 'Hambúrguer caseiro', gramas: 100, calorias: 240, proteinas: 20, carboidratos: 0, gorduras: 18 },
  { nome: 'Queijo cottage', gramas: 100, calorias: 100, proteinas: 11, carboidratos: 2, gorduras: 4 },
  { nome: 'Queijo minas', gramas: 100, calorias: 330, proteinas: 22, carboidratos: 1.5, gorduras: 26 },
  { nome: 'Queijo parmesão', gramas: 100, calorias: 430, proteinas: 36, carboidratos: 1, gorduras: 29 },
  { nome: 'Chocolate amargo 70%', gramas: 100, calorias: 590, proteinas: 7, carboidratos: 32, gorduras: 42 },
  { nome: 'Maçã gala', gramas: 100, calorias: 52, proteinas: 0.4, carboidratos: 14, gorduras: 0.2 },
  { nome: 'Laranja', gramas: 100, calorias: 47, proteinas: 0.9, carboidratos: 12, gorduras: 0.2 },
  { nome: 'Pêssego', gramas: 100, calorias: 39, proteinas: 0.7, carboidratos: 10, gorduras: 0.2 },
  { nome: 'Abacaxi', gramas: 100, calorias: 50, proteinas: 0.5, carboidratos: 13, gorduras: 0.1 },
  { nome: 'Uva roxa', gramas: 100, calorias: 69, proteinas: 0.7, carboidratos: 18, gorduras: 0.1 },
  { nome: 'Carne moída bovina (cozida)', gramas: 100, calorias: 250, proteinas: 26, carboidratos: 0, gorduras: 15 },
  { nome: 'Omelete simples', gramas: 100, calorias: 180, proteinas: 11, carboidratos: 1, gorduras: 14 },
  { nome: 'Soja cozida', gramas: 100, calorias: 173, proteinas: 16, carboidratos: 10, gorduras: 9 },
  { nome: 'Pipoca sem óleo', gramas: 100, calorias: 310, proteinas: 10, carboidratos: 60, gorduras: 5 },
  { nome: 'Barra de cereal', gramas: 100, calorias: 400, proteinas: 7, carboidratos: 65, gorduras: 10 },
  { nome: 'Iogurte de frutas', gramas: 100, calorias: 78, proteinas: 3.5, carboidratos: 12, gorduras: 2.5 },
];

async function main() {
  console.log('Iniciando o script de semente...');

  // 1. Criar Categorias
  console.log('Criando categorias da loja...');
  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('Categorias criadas!');

  // 2. Criar Produtos
  console.log('Criando produtos da loja...');
  for (const prod of productsData) {
    const { categorySlug, ...productData } = prod;
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {
        ...productData,
        category: { connect: { slug: categorySlug } },
      },
      create: {
        ...productData,
        category: { connect: { slug: categorySlug } },
      },
    });
  }
  console.log('Produtos criados!');

  // 3. Criar Alimentos
  console.log('Criando alimentos da calculadora...');
  for (const alim of alimentosData) {
    await prisma.alimento.upsert({
      where: { nome: alim.nome },
      update: alim,
      create: alim,
    });
  }
  console.log('Alimentos criados com sucesso!');

  // --- 4. POPULAR PEDIDOS ---
  console.log('🛒 Criando pedidos de teste...');

  // Tenta buscar o usuário "tu@gmail.com"
  let user = await prisma.usuario.findFirst({ where: { email: "tu@gmail.com" } });

  if (!user) {
    // Se não encontrar o seu, tenta um genérico ou cria um novo
    user = await prisma.usuario.findFirst();
    if (!user) {
       console.log('Nenhum usuário encontrado. Criando usuário admin@teste.com...');
       user = await prisma.usuario.create({
           data: {
               nome: "Admin Teste",
               email: "admin@teste.com",
               senha: "$2b$10$X7V.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0", // Hash genérico
               role: "ADMIN"
           }
       });
    }
  }

  // Buscar produtos reais do banco para usar nos pedidos
  const dbProducts = await prisma.product.findMany({ take: 3 });

  if (dbProducts.length >= 2) {
      const prod1 = dbProducts[0];
      const prod2 = dbProducts[1];

      // Limpar pedidos anteriores desse usuário para evitar duplicação infinita
      await prisma.itemPedido.deleteMany({ where: { pedido: { userId: user.id } } });
      await prisma.pedido.deleteMany({ where: { userId: user.id } });

      // PEDIDO 1: APROVADO
      await prisma.pedido.create({
          data: {
              userId: user.id,
              status: 'APROVADO',
              total: (prod1.preco * 2),
              createdAt: new Date('2023-11-15T10:00:00Z'),
              items: {
                  create: [
                      { productId: prod1.id, quantidade: 2, precoUnitario: prod1.preco }
                  ]
              }
          }
      });

      // PEDIDO 2: PENDENTE
      await prisma.pedido.create({
          data: {
              userId: user.id,
              status: 'PENDENTE',
              total: (prod1.preco + prod2.preco),
              createdAt: new Date(), // Data de hoje
              items: {
                  create: [
                      { productId: prod1.id, quantidade: 1, precoUnitario: prod1.preco },
                      { productId: prod2.id, quantidade: 1, precoUnitario: prod2.preco }
                  ]
              }
          }
      });

      // PEDIDO 3: NEGADO
      await prisma.pedido.create({
          data: {
              userId: user.id,
              status: 'NEGADO',
              total: prod2.preco,
              createdAt: new Date('2023-11-10T14:30:00Z'),
              items: {
                  create: [
                      { productId: prod2.id, quantidade: 1, precoUnitario: prod2.preco }
                  ]
              }
          }
      });

      console.log(`✅ 3 Pedidos criados para o usuário: ${user.email}`);
  } else {
      console.log('⚠️ Não há produtos suficientes no banco para criar pedidos de teste.');
  }
  
  console.log('✅ Script de semente finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro ao executar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });