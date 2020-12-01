import request from "supertest";
import app from "../../src/app";
import knex from "../../src/database";

let userToken;
let secondaryUserToken;
let user;
let secondaryUser;
let account;
let secondaryAccount;
let transaction;
let userTransaction;
let secondaryTransaction;

describe("Transactions Integration Tests", () => {
  beforeAll(async (done) => {
    const users = await knex("users").insert(
      [
        {
          name: "Test User #1",
          username: "testUser1",
          email: "testUser1@mail.com",
          password:
            "$2b$10$8W0igjk9iFTGXbjTlzs4c.CYXzdzpntnYuSewmZGk8KizH3z4fHkm",
        },
        {
          name: "Test User #2",
          username: "testUser2",
          email: "testUser2@mail.com",
          password:
            "$2b$10$8W0igjk9iFTGXbjTlzs4c.CYXzdzpntnYuSewmZGk8KizH3z4fHkm",
        },
      ],
      "*"
    );

    [user, secondaryUser] = users;

    const accounts = await knex("accounts").insert(
      [
        {
          name: "Inter Bank #1",
          user_id: user.id,
        },
        {
          name: "NuBank #2",
          user_id: secondaryUser.id,
        },
      ],
      "*"
    );

    [account, secondaryAccount] = accounts;

    const transactions = await knex("transactions").insert(
      [
        {
          description: "Transaction #1",
          date: new Date(),
          ammount: 150,
          type: "I",
          acc_id: account.id,
        },
        {
          description: "Transaction #2",
          date: new Date(),
          ammount: 315,
          type: "O",
          acc_id: secondaryAccount.id,
        },
      ],
      "*"
    );

    [transaction, secondaryTransaction] = transactions;

    const responseUserToken = await request(app).post("/auth/signin").send({
      email: "testUser1@mail.com",
      password: "test",
    });

    userToken = responseUserToken.body.token;

    const responseSecondaryUserToken = await request(app)
      .post("/auth/signin")
      .send({
        email: "testUser2@mail.com",
        password: "test",
      });

    secondaryUserToken = responseSecondaryUserToken.body.token;

    done();
  });

  afterAll(async (done) => {
    await knex("transactions").where({ id: transaction.id }).delete();
    await knex("transactions").where({ id: secondaryTransaction.id }).delete();
    await knex("accounts").where({ id: account.id }).delete();
    await knex("accounts").where({ id: secondaryAccount.id }).delete();
    await knex("users").where({ id: user.id }).delete();
    await knex("users").where({ id: secondaryUser.id }).delete();

    done();
  });

  it("Should list only user transactions", async (done) => {
    const response = await request(app)
      .get("/user/transactions")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].description).toBe("Transaction #1");
    done();
  });

  it("Should create a transaction", async (done) => {
    const response = await request(app)
      .post("/transactions")
      .send({
        description: "User Transaction #1",
        date: new Date(),
        ammount: 5000,
        type: "I",
        acc_id: account.id,
      })
      .set("Authorization", `Bearer ${userToken}`);

    userTransaction = response.body;
    expect(response.status).toBe(201);
    expect(response.body[0].acc_id).toBe(account.id);
    done();
  });

  it("Should delete a transaction", async (done) => {
    const res = await request(app)
      .delete(`/transactions/${userTransaction[0].id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(204);
    done();
  });
});
