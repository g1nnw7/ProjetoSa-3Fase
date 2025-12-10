import request from "supertest";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
import app from "../../src/app.js";

const prisma = new PrismaClient();
const SECRET = process.env.ACCESS_TOKEN_SECRET || "chave_secreta_teste_123";

describe("Integração - Rotas de Produtos", () => {
  let productId;
  let token;
  const CATEGORY_SLUG = "eletronicos-test"; 

  beforeAll(async () => {
    await prisma.itemPedido.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.token.deleteMany();
    await prisma.usuario.deleteMany();

    const user = await prisma.usuario.create({
      data: { 
        nome: "Admin Prod", 
        email: "prod@adm.com", 
        senha: await bcrypt.hash("123", 10),
        role: "ADMIN"
      }
    });
    
    token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });

    await prisma.category.create({
      data: {
        nome: "Eletrônicos",
        slug: CATEGORY_SLUG 
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("Deve criar um produto com sucesso", async () => {
    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "Notebook Gamer",
        descricao: "Placa de vídeo potente",
        preco: 5000.00,
        imageUrl: "http://img.com/note.jpg",
        categorySlug: CATEGORY_SLUG 
      });

    expect(res.status).toBe(201); 
    productId = res.body.id;
  });

  it("Deve listar todos os produtos", async () => {
    const res = await request(app).get("/products");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("Deve atualizar o produto", async () => {
    if (!productId) return; 
    const res = await request(app)
      .put(`/products/${productId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "Notebook Gamer Pro",
        preco: 5500.00,
        categorySlug: CATEGORY_SLUG
      });

    expect(res.status).toBe(200);
  });

  it("Deve deletar o produto", async () => {
    if (!productId) return;
    const res = await request(app)
      .delete(`/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200); 
  });
});