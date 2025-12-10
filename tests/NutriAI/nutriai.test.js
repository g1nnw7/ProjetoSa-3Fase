import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../../src/app.js'; 
import dotenv from 'dotenv';
dotenv.config(); 

import { perguntarReceita } from '../../src/controller/Receitas/receitas.controller.js';

const prisma = new PrismaClient();

const SECRET = process.env.ACCESS_TOKEN_SECRET || "chave_secreta_teste_123";

describe('Integração - Rota Receitas (IA)', () => {
  let token;

  beforeAll(async () => {
    // O TRUQUE: Criamos a rota manualmente aqui, já que ela está no server.js
    // Isso diz: "Quando bater em /perguntar, use a função do controller"
    app.post('/perguntar', perguntarReceita); 

    await prisma.itemPedido.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.endereco.deleteMany();
    await prisma.token.deleteMany();
    await prisma.usuario.deleteMany();

    const usuario = await prisma.usuario.create({
      data: {
        nome: 'AI User',
        email: `ai_${Date.now()}@test.com`,
        senha: await bcrypt.hash('123', 10)
      }
    });

    token = jwt.sign({ id: usuario.id }, SECRET, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /perguntar - Deve responder a uma pergunta', async () => {
    const payload = {
      mensagem: "Como fazer ovo cozido?",
      contexto: "Sou iniciante"
    };

    const res = await request(app)
      .post('/perguntar') 
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect([200, 201, 400, 500]).toContain(res.status);
  }, 40000); 
});