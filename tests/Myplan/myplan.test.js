import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../../src/app.js';

const prisma = new PrismaClient();

// "MATHIAS123" é a chave que copiei no .env
const SECRET = "MATHIAS123"; 

describe('Integração - Rotas MyPlan', () => {
  let token;

  beforeAll(async () => {
    // Se você esquecer de trocar a string acima, avisamos no console
    if (SECRET === "MATHIAS123") {
      console.warn("⚠️ ALERTA: Você esqueceu de colar a senha do .env no teste do MyPlan!");
    }

    // Limpeza do banco
    await prisma.itemPedido.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.endereco.deleteMany();
    await prisma.token.deleteMany();
    await prisma.usuario.deleteMany();

    const user = await prisma.usuario.create({
      data: {
        nome: 'Plan User',
        email: `plan_${Date.now()}@test.com`,
        senha: await bcrypt.hash('123', 10),
      }
    });

    // Gera o token usando a chave HARDCODED para garantir que bata com o servidor
    token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('GET /api/dashboard/myplan - Deve retornar histórico', async () => {
    const res = await request(app)
      .get('/api/dashboard/myplan')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('DELETE /api/dashboard/historico - Deve limpar histórico', async () => {
    const res = await request(app)
      .delete('/api/dashboard/historico')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});