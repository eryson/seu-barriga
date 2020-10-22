import request from "supertest";
import app from "../../src/app";
import knex from "../../src/database";

describe("Session Tests", () => {
  it("Should return jwt token when authenticated", async () => {
    const email = `${Date.now()}@mail.com`;

    const res = await request(app)
      .post("/users")
      .send({ name: "User Authenticated", email, password: "haveToken" });

    expect(res.status).toBe(201);

    const session = await request(app).post("/session").send({
      email,
      password: "haveToken",
    });

    expect(session.body).toHaveProperty("token");
  });

  it("Should not authenticated when wrong password", async () => {
    const email = `${Date.now()}@mail.com`;

    const res = await request(app)
      .post("/users")
      .send({ name: "User Authenticated", email, password: "haveToken" });

    expect(res.status).toBe(201);

    const session = await request(app).post("/session").send({
      email,
      password: "wrongPassword",
    });

    expect(session.status).toBe(401);
    expect(session.body.error).toBe("incorrect username or password");
  });
});
