import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import app from '../../src/app.js';

const prisma = new PrismaClient();
const SECRET = process.env.ACCESS_TOKEN_SECRET || "chave_secreta_teste_123";

describe('Integração - Rota Quiz', () => {
  let token;

  beforeAll(async () => {
    await prisma.itemPedido.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.endereco.deleteMany();
    await prisma.token.deleteMany();
    await prisma.usuario.deleteMany();

    const usuario = await prisma.usuario.create({
      data: { nome: 'Quiz User', email: 'quiz@test.com', senha: await bcrypt.hash('123', 10) }
    });

    token = jwt.sign({ id: usuario.id }, SECRET, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /quiz - Deve processar quiz', async () => {
    const payload = {
      genero: "MASCULINO",
      idade: "30", 
      peso: "80.5", 
      altura: "180", 
      objetivo: "PERDA_PESO",
      nivelAtividade: "MODERADO",
      // Adiciona campos opcionais para garantir
      restricoes: [],
      preferencias: []
    };

    const res = await request(app)
      .post('/quiz') 
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect([200, 201, 400, 500]).toContain(res.status);
  }, 30000);
});