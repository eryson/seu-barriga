import request from "supertest";
import app from "../src/app";

it("Should return all users", async () => {
  const res = await request(app).get("/users");
  expect(res.status).toBe(200);
});

it.skip("Should create a user", async () => {
  const res = await request(app)
    .post("/users")
    .send({ name: "Kylo Ren", mail: "kyle@firstorder.com" });
  expect(res.status).toBe(201);
  expect(res.body.name).toBe("Kylo Ren");
});
