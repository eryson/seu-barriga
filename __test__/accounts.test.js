import request from "supertest";
import app from "../src/app";

describe("Accounts Tests", () => {
  let user;

  beforeAll(async (done) => {
    const email = `${Date.now()}@mail.com`;
    user = await request(app)
      .post("/users")
      .send({ name: "Darth Vader", email, password: "IAmYourFather" });
    done();
  });

  it("Should create an account", async (done) => {
    const res = await request(app)
      .post("/accounts")
      .send({ name: "Skywalker #1", user_id: user.id });
    expect(res.status).toBe(201);
    done();
  });
});
