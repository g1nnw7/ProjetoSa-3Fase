import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Dados das Categorias
const categoriesData = [
  { nome: 'Whey Protein', slug: 'whey-protein' },
  { nome: 'Creatina', slug: 'creatina' },
  { nome: 'Pré Treino', slug: 'pre-treino' },
  { nome: 'Acessórios', slug: 'acessorios' },
  { nome: 'Moda', slug: 'moda' },
];

// Dados dos Produtos de Exemplo
const productsData = [
  // --- Whey Protein ---
  {
    nome: 'Whey 100% Concentrado (900g)',
    slug: 'whey-100-concentrado-900g',
    descricao: 'Proteína concentrada do soro do leite de alta qualidade, ideal para ganho de massa muscular. Sabor baunilha.',
    preco: 129.90,
    imageUrl: 'public/img/wheyConcentreado900g.png',
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
    imageUrl: 'public/img/creatina-monohidratada.png',
    estoque: 100,
    isVegano: true,
    categorySlug: 'creatina',
  },
  {
    nome: 'Creatina Micronizada (150g)',
    slug: 'creatina-micronizada-150g',
    descricao: 'Fácil diluição e absorção otimizada. A creatina micronizada leva seus treinos a outro nível.',
    preco: 69.90,
    imageUrl: 'public/img/creatina-micronizada.png',
    estoque: 70,
    categorySlug: 'creatina',
  },

  // --- Pré Treino ---
  {
    nome: 'Pré Treino "Égide" (Sabor Frutas Vermelhas)',
    slug: 'pre-treino-egide-frutas',
    descricao: 'Foco, energia e vasodilatação. Prepare-se para treinos mais intensos.',
    preco: 119.90,
    imageUrl: 'public/img/pre-frutas-vermelhas.png',
    estoque: 40,
    calorias: 5,
    categorySlug: 'pre-treino',
  },
  {
    nome: 'Pré Treino "Hórus" (Sabor Maçã Verde)',
    slug: 'pre-treino-horus-maca',
    descricao: 'A fórmula Hórus foi desenvolvida para quem busca performance extrema. Contém cafeína e beta-alanina.',
    preco: 109.90,
    imageUrl: 'public/img/pre-treino.png',
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
    imageUrl: 'public/img/coqueteleira.png',
    estoque: 200,
    categorySlug: 'acessorios',
  },
  {
    nome: 'Galão de Água (2L) - Rosa',
    slug: 'galao-agua-2l-rosa',
    descricao: 'Mantenha-se hidratado durante todo o dia com estilo. Plástico resistente e livre de BPA.',
    preco: 45.00,
    imageUrl: 'public/img/galao.png',
    estoque: 80,
    categorySlug: 'acessorios',
  },

  // --- Moda ---
  {
    nome: 'Camiseta Dry Fit (Preta)',
    slug: 'camiseta-dry-fit-preta',
    descricao: 'Conforto e tecnologia para seus treinos. Tecido leve que absorve o suor.',
    preco: 79.90,
    imageUrl: 'public/img/camiseta.png',
    estoque: 50,
    categorySlug: 'moda',
  },
  {
    nome: 'Legging de Treino (Grafite)',
    slug: 'legging-treino-grafite',
    descricao: 'Alta compressão e zero transparência. Perfeita para agachamentos e corridas.',
    preco: 119.90,
    imageUrl: 'public/img/leggin.png',
    estoque: 40,
    categorySlug: 'moda',
  },
];

async function main() {
  console.log('Iniciando o script de semente...');

  // --- 1. Criar Categorias ---
  // Usamos 'upsert' para evitar duplicatas se o script rodar novamente
  console.log('Criando categorias...');
  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('Categorias criadas com sucesso!');

  // --- 2. Criar Produtos ---
  console.log('Criando produtos...');
  for (const prod of productsData) {
    // Pega o slug da categoria do produto e o remove do objeto
    const { categorySlug, ...productData } = prod;

    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {
        ...productData,
        // Conecta o produto à categoria existente
        category: {
          connect: {
            slug: categorySlug,
          },
        },
      },
      create: {
        ...productData,
        // Conecta o produto à categoria existente
        category: {
          connect: {
            slug: categorySlug,
          },
        },
      },
    });
  }
  console.log('Produtos criados com sucesso!');
  console.log('Script de semente finalizado.');
}

// Executa a função principal e lida com erros
main()
  .catch((e) => {
    console.error('Erro ao executar o script de semente:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Fecha a conexão com o banco de dados
    await prisma.$disconnect();
  });