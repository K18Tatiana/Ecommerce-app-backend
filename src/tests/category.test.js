const request = require('supertest');
const app = require('../app');
require('../models');

let token;

beforeAll(async() => {
    const credentials = {
        email: "admin@gmail.com",
        password: "admin1234"
    };
    const res = await request(app)
        .post('/api/v1/users/login')
        .send(credentials);
    token = res.body.token;
});

test("POST /api/v1/categories should create one category", async() => {
    const newCategory = { name: "Smartphones" };
    const res = await request(app)
        .post("/api/v1/categories")
        .send(newCategory)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(newCategory.name);
});

test("GET /api/v1/categories should return all categories", async() => {
    const res = await request(app).get("/api/v1/categories");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
});