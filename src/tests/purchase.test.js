const request = require('supertest');
const app = require('../app');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
require('../models');

let token, userId;

beforeAll(async() => {
    const credentials = {
        email: "admin@gmail.com",
        password: "admin1234"
    };
    const res = await request(app)
        .post("/api/v1/users/login")
        .send(credentials);
    token = res.body.token;
    userId = res.body.user.id;
});

test("POST /api/v1/purchases should add cart to shopping and remove cart", async() => {
    const product = await Product.create({
        title: "Samsung Galaxy S22",
        description: "Smartphone, Factory Unlocked Android Cell Phone, 256GB, 8K Camera & Video, Brightest Display, Long Battery Life, Fast 4nm Processor, US Version. 8K SUPER STEADY VIDEO: Shoot videos that rival how epic your life is with stunning 8K recording, the highest recording resolution available on a smartphone; Video captured is effortlessly smooth, thanks to Auto Focus Video Stabilization on Galaxy S22",
        price: 850.00
    });
    await Cart.bulkCreate([
        {
            quantity: 3,
            productId: product.id,
            userId
        }
    ]);
    let cart = await Cart.findAll({ 
        attributes: [ 'quantity', 'userId', 'productId' ],
        raw: true
    });
    const res = await request(app)
        .post("/api/v1/purchases")
        .send(cart)
        .set('Authorization', `Bearer ${token}`);
    
    await product.destroy();
    await Cart.destroy({ where: { userId } });
    cart = await Cart.findAll();
    expect(res.status).toBe(200);
    expect(cart).toHaveLength(0);
});

test("GET /api/v1/purchases should return all the purchases", async() => {
    const res = await request(app)
        .get("/api/v1/purchases")
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
});