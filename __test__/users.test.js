const request = require("supertest");
const app = require("../src/app");

test("Should return all users", async () => {
  const res = await request(app).get("/users");
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(1);
  expect(res.body[0]).toHaveProperty("name", "Jhon Doe");
});
