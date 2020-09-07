import request from "supertest";
import app from "../src/app";

it("Should return all users", async () => {
  const res = await request(app).get("/users");
  expect(res.status).toBe(200);
  expect(res.body.length).toBeGreaterThan(0);
});

it("Should create a user", async () => {
  const email = `${Date.now()}@mail.com`;
  const res = await request(app)
    .post("/users")
    .send({ name: "Stormtroopers", email, password: "GalacticEmpire" });
  expect(res.status).toBe(201);
});
