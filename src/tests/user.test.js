const request = require('supertest');
const app = require('../app');

let userId, token;

test("POST /api/v1/users should create a user ", async() => {
    const newUser = {
        firstName: "Tatiana",
        lastName: "Vega",
        email: "tatianavegac2003@gmail.com",
        password: "tatis2304",
        phone: "+573127221260"
    }
    const res = await request(app)
        .post("/api/v1/users")
        .send(newUser);
    userId = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body.email).toBe(newUser.email);
});

test("POST /api/v1/users/login should do login", async() => {
    const user = {
        email: "tatianavegac2003@gmail.com",
        password: "tatis2304"
    }
    const res = await request(app)
        .post("/api/v1/users/login")
        .send(user);
    token = res.body.token;
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(user.email);
    expect(res.body.token).toBeDefined();
});

test("POST /api/v1/users/login with invalid credentials should return 401", async() => {
    const user = {
        email: "tatianavegac2003@gmail.com",
        password: "tatis10"
    }
    const res = await request(app).post("/api/v1/users/login").send(user);
    expect(res.status).toBe(401);
});

test("GET /api/v1/users should return all users", async() => {
    const res = await request(app)
        .get("/api/v1/users")
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
});

test("PUT /api/v1/users/:id should update a user", async() => {
    const body = {
        firstName: "Karen"
    }
    const res = await request(app)
        .put(`/api/v1/users/${userId}`)
        .send(body)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe(body.firstName);
});

test("DELETE /api/v1/users/:id should delete a user", async() => {
    const res = await request(app)
        .delete(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
});