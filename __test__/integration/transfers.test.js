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
let transfer;
let secondaryTransfer;
let userTransfer;

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

    const transfers = await knex("transfers").insert(
      [
        {
          description: "Transfer #1",
          date: new Date(),
          ammount: 10,
          acc_ori_id: account.id,
          acc_dest_id: secondaryAccount.id,
          user_id: user.id,
        },
        {
          description: "Transfer #2",
          date: new Date(),
          ammount: 15,
          acc_ori_id: secondaryAccount.id,
          acc_dest_id: account.id,
          user_id: secondaryUser.id,
        },
      ],
      "*"
    );

    [transfer, secondaryTransfer] = transfers;

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
    await knex("transfers").where({ id: transfer.id }).delete();
    await knex("transfers").where({ id: secondaryTransfer.id }).delete();
    await knex("transactions").where({ id: transaction.id }).delete();
    await knex("transactions").where({ id: secondaryTransaction.id }).delete();
    await knex("accounts").where({ id: account.id }).delete();
    await knex("accounts").where({ id: secondaryAccount.id }).delete();
    await knex("users").where({ id: user.id }).delete();
    await knex("users").where({ id: secondaryUser.id }).delete();

    done();
  });

  it("Should list only user transfers", async (done) => {
    const response = await request(app)
      .get("/user/transfers")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].description).toBe("Transfer #1");
    done();
  });

  it("Should create a transfer", async (done) => {
    const response = await request(app)
      .post("/transfers")
      .send({
        description: "User Transfer #1",
        date: new Date(),
        ammount: 10,
        acc_ori_id: account.id,
        acc_dest_id: secondaryAccount.id,
        user_id: user.id,
      })
      .set("Authorization", `Bearer ${userToken}`);

    userTransfer = response.body;
    expect(response.status).toBe(201);
    expect(response.body[0].user_id).toBe(user.id);
    done();
  });

  it("Should not create a transfer without description", async (done) => {
    const response = await request(app)
      .post("/transfers")
      .send({
        date: new Date(),
        ammount: 10,
        acc_ori_id: account.id,
        acc_dest_id: secondaryAccount.id,
        user_id: user.id,
      })
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "Data is missing for creating the transfer."
    );
    done();
  });

  it("Should return a transfer by id", async (done) => {
    const response = await request(app)
      .get(`/transfers/${userTransfer[0].id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body[0].description).toBe("User Transfer #1");
    done();
  });

  it("Should not list another user's transfers", async (done) => {
    const response = await request(app)
      .get(`/transfers/${userTransfer[0].id}`)
      .set("Authorization", `Bearer ${secondaryUserToken}`);

    expect(response.status).toBe(403);
    expect(response.body.error).toBe("Request not allowed for this user.");

    done();
  });

  it("Should delete a transfer", async (done) => {
    const res = await request(app)
      .delete(`/transfers/${userTransfer[0].id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(204);
    done();
  });
});
