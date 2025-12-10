# 🍏 NutriFit

![Badge de Status: Em Desenvolvimento](https://img.shields.io/badge/Status-Em%20Desenvolvimento-blue)
![Badge de Licença: MIT](https://img.shields.io/badge/License-MIT-green)



## ✨ Visão Geral e Funcionalidades

O *NutriFit* é uma plataforma web abrangente desenvolvida para auxiliar usuários em sua jornada de saúde e fitness, integrando funcionalidades essenciais de nutrição e comércio eletrônico:

1.  *Calculadora de Macronutrientes:* Calcula as necessidades diárias de calorias, proteínas, carboidratos e gorduras com base em dados do usuário e seus objetivos.
2.  *Gerador de Plano Alimentar:* Gera sugestões de planos de refeição personalizados, adaptados aos cálculos de nutrientes.
3.  *E-commerce Fitness:* Uma loja virtual integrada que permite a compra de suplementos e produtos fitness relacionados.
3.  *Inteligência Artificial:* Uma IA desenvolvida para auxiliar a rotina de alimentação do usuário.

---

## 🛠 Tecnologias Utilizadas (Stack)

O projeto segue uma arquitetura *Full-Stack JavaScript* dividida em Frontend e Backend, com gerenciamento de banco de dados via ORM.

### Frontend
* *Framework/Biblioteca:* React
* *Ponto de Entrada:* main.jsx
* *Estilização:* CSS (tailwind)

### Backend
* *Runtime:* Node.js
* *Framework/Servidor:* Express e React
* *Banco de Dados/ORM:* Prisma (Definição de schema em /prisma)
* *Linguagem:* JavaScript / TypeScript (Inferido pela estrutura)

---

## ⚙ Estrutura de Arquivos e Decisões Arquiteturais

A aplicação segue o padrão de *Separação de Preocupações (SoC)*, dividindo as funcionalidades do backend em camadas e o frontend em componentes modulares.

| Diretório | Conteúdo | Propósito Arquitetural |
| :--- | :--- | :--- |
| prisma/ | Esquema de dados e Migrações | Define o modelo de dados e garante a integridade estrutural do banco. |
| src/controller/ | Lógica de Negócio (Backend) | Recebe dados das rotas e processa a regra de negócio antes de chamar os serviços. |
| src/routes/ | Definição de Rotas (API) | Mapeia os endpoints HTTP para as funções dos Controllers. |
| src/services/ | Acesso a Dados | Funções que interagem diretamente com o ORM (Prisma) e APIs externas. |
| src/pages/ | Páginas/Views (Frontend) | Componentes de alto nível que definem o layout de cada rota da aplicação. |
| src/components/ | Componentes Reutilizáveis (UI) | Elementos visuais modulares para construir a interface. |

---

## 🚀 Instalação e Execução Local

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:
* Node.js
* Gerenciador de Pacote: npm
* Um servidor de banco de dados compatível com Prisma (PostgreSQL)

### Instrução de instalação 

- npm i
- npx prisma generate
- npx prisma migrate dev
- npm run prisma:seed
- npm start
- e npm run dev

---

## 🧠 Decisões Arquiteturais Chave
- Linguagem & Ambiente: JavaScript com módulos ESM ("type": "module") tanto no frontend quanto no backend (Node.js).

- Estilo de Código: Utiliza ESLint com configurações específicas para React Hooks e módulos ESM (eslint.config.js).

- Segurança (Hashing): As senhas são hasheadas usando a biblioteca bcrypt com um fator de custo de 10 rounds (saltRounds = 10), garantindo um armazenamento seguro (hash.js).

- Autenticação: Gerenciada por JSON Web Tokens (JWT), com configuração de tempo de vida (TTL) de 15 minutos para o accessTtl e 8 horas para o refreshTtl (env.js).

## Integrações Externas

- Pagamentos: Módulo mercadopago.

- Inteligência Artificial: Módulo openai (para implementações de IA, como assistente nutricional).

---

## Clonar o Repositório

```bash
git clone 
https://github.com/g1nnw7/ProjetoSa-3Fase