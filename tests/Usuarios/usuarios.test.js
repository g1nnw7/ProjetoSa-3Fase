import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../../src/app.js';

const prisma = new PrismaClient();

describe('Integração - Rotas de Usuário', () => {
  beforeAll(async () => {
    await prisma.itemPedido.deleteMany();
    await prisma.pedido.deleteMany();
    await prisma.endereco.deleteMany();
    await prisma.token.deleteMany();
    await prisma.usuario.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /usuarios - Deve criar um usuário com sucesso', async () => {
    const emailTeste = `teste_${Date.now()}@user.com`;

    const res = await request(app)
      .post('/usuarios')
      .send({
        nome: 'Teste User',
        email: emailTeste,
        senha: '123password'
      });

    expect(res.status).toBe(201); 
    expect(res.body).toHaveProperty('id');
  });

  it('GET /usuarios - Deve listar usuários', async () => {
    await prisma.usuario.create({
      data: { nome: "Extra", email: "extra@test.com", senha: "123" }
    });
    
    const res = await request(app).get('/usuarios');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});