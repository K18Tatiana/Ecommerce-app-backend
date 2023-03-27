const request = require('supertest');
const app = require('../app');
const Product = require('../models/Product');
require('../models');

let token, productId;

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

test("POST /api/v1/cart should create one product to the cart", async() => {
    const product = await Product.create({
        title: "Samsung Galaxy S22",
        description: "Smartphone, Factory Unlocked Android Cell Phone, 256GB, 8K Camera & Video, Brightest Display, Long Battery Life, Fast 4nm Processor, US Version. 8K SUPER STEADY VIDEO: Shoot videos that rival how epic your life is with stunning 8K recording, the highest recording resolution available on a smartphone; Video captured is effortlessly smooth, thanks to Auto Focus Video Stabilization on Galaxy S22",
        price: 850.00
    });
    const cart = {
        quantity: 3,
        productId: product.id
    };
    const res = await request(app)
        .post("/api/v1/cart")
        .send(cart)
        .set('Authorization', `Bearer ${token}`);
    productId = res.body.id;
    await product.destroy();
    expect(res.status).toBe(201);
    expect(res.body.quantity).toBe(cart.quantity);
});

test("GET /api/v1/cart should return all products from the cart", async() => {
    const res = await request(app)
        .get("/api/v1/cart")
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
});

test("PUT /api/v1/cart/:id should update cart", async() => {
    const body = {
        quantity: 2,
        productId
    };
    const res = await request(app)
        .put(`/api/v1/cart/${productId}`)
        .send(body)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(body.quantity);
});

test("DELETE /api/v1/cart/:id should delete one product from the cart", async() => {
    const res = await request(app)
        .delete(`/api/v1/cart/${productId}`)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
});