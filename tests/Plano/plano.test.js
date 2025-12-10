import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import app from '../../src/app.js';

const prisma = new PrismaClient();

describe('Integração - Rota Plano Atual', () => {
  let token;

  beforeAll(async () => {
    await prisma.itemPedido.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.endereco.deleteMany();
    await prisma.token.deleteMany();
    await prisma.usuario.deleteMany();

    const user = await prisma.usuario.create({
      data: {
        nome: 'Plano User',
        email: 'plano@test.com',
        senha: await bcrypt.hash('123', 10)
      }
    });

    token = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('GET /quiz/plano - Deve acessar a rota com token válido', async () => {
    const res = await request(app)
      .get('/quiz/plano')
      .set('Authorization', `Bearer ${token}`);
      
    expect([200, 404]).toContain(res.status);
  });
});