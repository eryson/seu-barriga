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
    const res = await request(app)
      .post("/accounts")
      .send({ name: "Skywalker #1", user_id: user.body[0] });
    expect(res.status).toBe(201);
    done();
  });

  it("Should return all accounts", async (done) => {
    const res = await request(app).get("/accounts");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    done();
  });

  it("Should return an account by id", async (done) => {
    const res = await request(app).get("/accounts/1");
    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe("Skywalker #1");
    expect(res.body.length).toBe(1);
    done();
  });
});
