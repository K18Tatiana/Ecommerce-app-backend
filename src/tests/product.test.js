const request = require("supertest");
const app = require("../app");
const ProductImg = require("../models/ProductImg");
require('../models');

let token, productId, productTitle;

beforeAll(async() => {
    const credentials = {
        email: "admin@gmail.com",
        password: "admin1234"
    };
    const res = await request(app)
        .post("/api/v1/users/login")
        .send(credentials);
    token = res.body.token;
});

test("POST /api/v1/products should create one product", async() => {
    const newProduct = {
        title: "Samsung Galaxy S22",
        description: "Smartphone, Factory Unlocked Android Cell Phone, 256GB, 8K Camera & Video, Brightest Display, Long Battery Life, Fast 4nm Processor, US Version. 8K SUPER STEADY VIDEO: Shoot videos that rival how epic your life is with stunning 8K recording, the highest recording resolution available on a smartphone; Video captured is effortlessly smooth, thanks to Auto Focus Video Stabilization on Galaxy S22",
        price: 850.00
    };
    const res = await request(app)
        .post("/api/v1/products")
        .send(newProduct)
        .set('Authorization', `Bearer ${token}`);
    productId = res.body.id;
    productTitle = res.body.title;
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(newProduct.title);
});

test("GET /api/v1/products should return all products", async() => {
    const res = await request(app).get('/api/v1/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
});

test("GET /api/v1/products/:id should return one product", async() => {
    const res = await request(app).get(`/api/v1/products/${productId}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(productTitle);
});

test("PUT /api/v1/products/:id should update one product", async() => {
    const body = {
        title: "Samsung Galaxy S22 updated"
    };
    const res = await request(app)
        .put(`/api/v1/products/${productId}`)
        .send(body)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(body.title);
});

test("POST /api/v1/products/:id/images should set the product images", async() => {
    const image = await ProductImg.create({
        url: "image.png",
        filename: "imagen1.png"
    });
    const res = await request(app)
        .post(`/api/v1/products/${productId}/images`)
        .send([image.id])
        .set('Authorization', `Bearer ${token}`);
    await image.destroy();
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
});

test("DELETE /api/v1/products/:id should delete one product", async() => {
    const res = await request(app)
        .delete(`/api/v1/products/${productId}`)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
});