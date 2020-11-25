import request from "supertest";
import app from "../../src/app";
import generateToken from "../../src/utils/generateToken";

const token = generateToken();

describe("Accounts Tests", () => {
  let user;
  let account;
  let secondaryUser;
  let secondaryAccount;

  beforeAll(async (done) => {
    const response = await request(app)
      .post("/users")
      .send({
        username: "user_test",
        name: "User Test",
        email: "user_test@mail.com",
        password: "userTest",
      })
      .set("Authorization", `Bearer ${token}`);

    user = response;

    const responseSecondaryUser = await request(app)
      .post("/users")
      .send({
        username: "secondary_user",
        name: "Secondary User",
        email: "secondary_user@mail.com",
        password: "secondaryUser",
      })
      .set("Authorization", `Bearer ${token}`);

    secondaryUser = responseSecondaryUser;
    done();
  });

  it("Should create an account", async (done) => {
    const res = await request(app)
      .post("/accounts")
      .send({ name: "NuBank #1", user: user.body[0] })
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
      .send({ name: "NuBank #1", user: secondaryUser.body[0] })
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

  it("Should delete an account by id", async (done) => {
    const responseAccount = await request(app)
      .delete(`/accounts/${account.body[0]}`)
      .set("Authorization", `Bearer ${token}`);

    expect(responseAccount.status).toBe(204);

    const responseSecondaryAccount = await request(app)
      .delete(`/accounts/${secondaryAccount.body[0]}`)
      .set("Authorization", `Bearer ${token}`);

    expect(responseSecondaryAccount.status).toBe(204);

    const responseUser = await request(app)
      .delete(`/users/${user.body[0].id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(responseUser.status).toBe(204);

    const responseSecondaryUser = await request(app)
      .delete(`/users/${secondaryUser.body[0].id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(responseSecondaryUser.status).toBe(204);

    done();
  });
});
