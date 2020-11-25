import request from "supertest";
import app from "../../src/app";
import generateToken from "../../src/utils/generateToken";

const testToken = generateToken();

describe("Accounts Tests", () => {
  let user;
  let account;

  beforeAll(async (done) => {
    const res = await request(app)
      .post("/users")
      .send({
        username: "darkside",
        name: "Darth Vader",
        email: "darkside@theForce.com",
        password: "Empire",
      })
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
      .get(`/accounts/${account.body[0]}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe("NuBank #1");
    expect(res.body.length).toBe(1);
    done();
  });

  it("Should update an account by id", async (done) => {
    const res = await request(app)
      .put(`/accounts/${account.body[0]}`)
      .send({ name: "Inter #1" })
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.status).toBe(200);
    done();
  });

  it("Should delete an account by id", async (done) => {
    const res = await request(app)
      .delete(`/accounts/${account.body[0]}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.status).toBe(204);

    const response = await request(app)
      .delete(`/users/${user.body[0].id}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(204);

    done();
  });
});
