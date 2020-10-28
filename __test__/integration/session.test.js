import request from "supertest";
import app from "../../src/app";
import knex from "../../src/database";

describe("Session Tests", () => {
  it("Should return jwt token when authenticated", async (done) => {
    const email = `${Date.now()}@mail.com`;

    const res = await request(app)
      .post("/users")
      .send({ name: "User Authenticated", email, password: "haveToken" });

    expect(res.status).toBe(201);

    const session = await request(app).post("/session/signin").send({
      email,
      password: "haveToken",
    });

    expect(session.body).toHaveProperty("token");
    done();
  });

  it("Should not authenticated when wrong password", async (done) => {
    const email = `${Date.now()}@mail.com`;

    const res = await request(app)
      .post("/users")
      .send({ name: "User Authenticated", email, password: "haveToken" });

    expect(res.status).toBe(201);

    const session = await request(app).post("/session/signin").send({
      email,
      password: "wrongPassword",
    });

    expect(session.status).toBe(401);
    expect(session.body.error).toBe("incorrect username or password");
    done();
  });

  it("Should not authenticated when user does not exists", async (done) => {
    const session = await request(app).post("/session/signin").send({
      email: "user_not_exists@mail.com",
      password: "wrongPassword",
    });

    expect(session.status).toBe(400);
    expect(session.body.error).toBe("user does not exists");
    done();
  });
});
