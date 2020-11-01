import request from "supertest";
import app from "../../src/app";
import generateToken from "../../src/utils/generateToken";

const testToken = generateToken();

describe("Accounts Tests", () => {
  const email = `${Date.now()}@mail.com`;
  let user;
  let account;

  beforeAll(async (done) => {
    const email = `${Date.now()}@mail.com`;
    const res = await request(app)
      .post("/users")
      .send({ name: "Darth Vader", email, password: "IAmYourFather" })
      .set("Authorization", `Bearer ${testToken}`);

    user = res;
    done();
  });

  it("Should create an account", async (done) => {
    const res = await request(app)
      .post("/accounts")
      .send({ name: "NuBank #1", user: user.body[0] })
      .set("Authorization", `Bearer ${testToken}`);

    account = res;
    expect(res.status).toBe(201);
    done();
  });

  it("Should return all accounts", async (done) => {
    const res = await request(app)
      .get("/accounts")
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    done();
  });

  it("Should return an account by id", async (done) => {
    const res = await request(app)
      .get("/accounts/1")
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe("Skywalker #1");
    expect(res.body.length).toBe(1);
    done();
  });

  it("Should update an account by id", async (done) => {
    const user = await request(app)
      .post("/users")
      .send({
        name: "#GoEmpire",
        email: email,
        password: "GoEmpire",
      })
      .set("Authorization", `Bearer ${testToken}`);

    const account = await request(app)
      .post("/accounts")
      .send({ name: "Inter #1", user_id: user.body[0] })
      .set("Authorization", `Bearer ${testToken}`);

    const res = await request(app)
      .put(`/accounts/${account.body[0]}`)
      .send({ name: "Inter #2" })
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.status).toBe(200);
    done();
  });

  it("Should delete an account by id", async (done) => {
    const res = await request(app)
      .delete(`/accounts/${account.body[0]}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.status).toBe(204);
    done();
  });
});
