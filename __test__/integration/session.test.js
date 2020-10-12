import request from "supertest";
import app from "../../src/app";

describe("Session Tests", () => {
  const email = `${Date.now()}@mail.com`;

  it("Should return jwt token when authenticated", async () => {
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
});
