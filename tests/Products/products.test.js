import request from "supertest";
import app from "../src/app.js";

describe("Testes das rotas de Products", () => {

  let productId;
  const tokenFake = "123tokenFake"; // mock do token


  // 1 — Criar produto
 
  it("Deve criar um produto (POST /products)", async () => {
    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${tokenFake}`)
      .send({
        name: "Camiseta Premium",
        description: "Tecido leve e confortável",
        price: 99.9,
        imageUrl: "public/camiseta.jpg"
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Camiseta Premium");
    expect(response.body.price).toBe(99.9);

    productId = response.body.id;
  });

  
  // 2 — Listar produtos

  it("Deve listar todos os produtos (GET /products)", async () => {
    const response = await request(app).get("/products");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    const item = response.body[0];
    expect(item).toHaveProperty("id");
    expect(item).toHaveProperty("name");
  });

 
  // 3 — Buscar produto por ID

  it("Deve retornar um produto específico (GET /products)", async () => {
    const response = await request(app).get("/products");

    // procure o produto criado no array
    const encontrado = response.body.find(p => p.id === productId);

    expect(encontrado).toBeDefined();
    expect(encontrado.id).toBe(productId);
    expect(encontrado).toHaveProperty("name");
  });

  
  // 4 — Atualizar produto

  it("Deve atualizar o produto (PUT /products/:id)", async () => {
    const response = await request(app)
      .put(`/products/${productId}`)
      .set("Authorization", `Bearer ${tokenFake}`)
      .send({
        name: "Camiseta Premium Editada",
        price: 129.9
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(productId);
    expect(response.body.name).toBe("Camiseta Premium Editada");
    expect(response.body.price).toBe(129.9);
  });


  // 5 — Deletar produto

  it("Deve deletar o produto (DELETE /products/:id)", async () => {
    const response = await request(app)
      .delete(`/products/${productId}`)
      .set("Authorization", `Bearer ${tokenFake}`);

    expect(response.status).toBe(204);

    // Confere se realmente sumiu
    const lista = await request(app).get("/products");
    const existe = lista.body.find(p => p.id === productId);

    expect(existe).toBeUndefined();
  });

});