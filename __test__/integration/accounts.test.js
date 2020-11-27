import request from "supertest";
import app from "../../src/app";

let token;
let secondaryToken;
let user;
let account;
let secondaryUser;
let secondaryAccount;

describe("Accounts Tests", () => {
  beforeAll(async (done) => {
    const userResponse = await request(app).post("/auth/signup").send({
      username: "user_test",
      name: "User Test",
      email: "user_test@mail.com",
      password: "userTest",
    });

    user = userResponse.body;

    const secondaryUserResponse = await request(app).post("/auth/signup").send({
      username: "secondary_user",
      name: "Secondary User",
      email: "secondary_user@mail.com",
      password: "secondaryUser",
    });

    secondaryUser = secondaryUserResponse.body;

    const res = await request(app).post("/auth/signin").send({
      email: "user_test@mail.com",
      password: "userTest",
    });

    token = res.body.token;

    const response = await request(app).post("/auth/signin").send({
      email: "secondary_user@mail.com",
      password: "secondaryUser",
    });

    secondaryToken = response.body.token;
    done();
  });

  it("Should create an account", async (done) => {
    const res = await request(app)
      .post("/accounts")
      .send({ name: "NuBank #1", user: user[0].id })
      .set("Authorization", `Bearer ${token}`);

    account = res;
    expect(res.status).toBe(201);
    done();
  });

  it("Should return all accounts", async (done) => {
    const res = await request(app)
      .get("/accounts")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    done();
  });

  it("Should return an account by id", async (done) => {
    const res = await request(app)
      .get(`/accounts/${account.body[0]}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe("NuBank #1");
    expect(res.body.length).toBe(1);
    done();
  });

  it("Should update an account by id", async (done) => {
    const res = await request(app)
      .put(`/accounts/${account.body[0]}`)
      .send({ name: "Inter #1" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    done();
  });

  it("Should list only user accounts", async (done) => {
    const res = await request(app)
      .post("/accounts")
      .send({ name: "NuBank #1", user: secondaryUser[0].id })
      .set("Authorization", `Bearer ${token}`);

    secondaryAccount = res;
    expect(res.status).toBe(201);

    const response = await request(app)
      .get(`/accounts/${secondaryAccount.body[0]}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body[0].name).toBe("NuBank #1");
    expect(response.body.length).toBe(1);

    done();
  });

  it("Should not insert an account with a duplicate name for the same user", async (done) => {
    const response = await request(app)
      .post("/accounts")
      .send({ name: "NuBank #1", user: secondaryUser[0].id })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "This account already exists for this user."
    );
    done();
  });

  it("Should delete an account by id", async (done) => {
    const responseAccount = await request(app)
      .delete(`/accounts/${account.body[0]}`)
      .set("Authorization", `Bearer ${token}`);

    expect(responseAccount.status).toBe(204);

    const responseSecondaryAccount = await request(app)
      .delete(`/accounts/${secondaryAccount.body[0]}`)
      .set("Authorization", `Bearer ${secondaryToken}`);

    expect(responseSecondaryAccount.status).toBe(204);

    const responseUser = await request(app)
      .delete(`/users/${user[0].id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(responseUser.status).toBe(204);

    const responseSecondaryUser = await request(app)
      .delete(`/users/${secondaryUser[0].id}`)
      .set("Authorization", `Bearer ${secondaryToken}`);

    expect(responseSecondaryUser.status).toBe(204);

    done();
  });
});
