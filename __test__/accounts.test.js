import request from "supertest";
import app from "../src/app";

describe("Accounts Tests", () => {
  let user;

  beforeAll(async (done) => {
    const email = `${Date.now()}@mail.com`;
    const res = await request(app)
      .post("/users")
      .send({ name: "Darth Vader", email, password: "IAmYourFather" });
    user = res;
    done();
  });

  it("Should create an account", async (done) => {
    console.log("user => ", user.body[0]);
    const res = await request(app)
      .post("/accounts")
      .send({ name: "Skywalker #1", user_id: user.body[0] });
    expect(res.status).toBe(201);
    done();
  });
});
