import request from "supertest";
import app from "../../src/app";

let token;
let user;
let secondaryUser;
let secondaryToken;

describe("Users Integration Tests", () => {
  it("Should create a user", async (done) => {
    const res = await request(app).post("/auth/signup").send({
      username: "user_test",
      name: "User Test",
      email: "user_test@mail.com",
      password: "userTest",
    });

    user = res.body;
    expect(res.status).toBe(201);

    const response = await request(app).post("/auth/signin").send({
      email: "user_test@mail.com",
      password: "userTest",
    });

    token = response.body.token;
    done();
  });

  it("Should return all users", async (done) => {
    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body).not.toHaveProperty("password");
    done();
  });

  it("Should return an user by id", async (done) => {
    const res = await request(app)
      .get(`/users/${user[0].id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe("User Test");
    expect(res.body.length).toBe(1);
    done();
  });

  it("Should encrypt the user password", async (done) => {
    const res = await request(app)
      .post("/users")
      .send({
        username: "user_test_encrypt",
        name: "User Test Encrypt",
        email: "user_test_encrypt@mail.com",
        password: "userTestEncrypt",
      })
      .set("Authorization", `Bearer ${token}`);

    secondaryUser = res.body;
    expect(res.status).toBe(201);
    expect(res.body.password).not.toBe("userTestEncrypt");

    const response = await request(app).post("/auth/signin").send({
      email: "user_test_encrypt@mail.com",
      password: "userTestEncrypt",
    });

    secondaryToken = response.body.token;
    done();
  });

  it("Should not create a user without the name", async (done) => {
    const res = await request(app)
      .post("/users")
      .send({ username: "notCreateUser", password: "passwordUser" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Data is missing for user creation.");
    done();
  });

  it("Should not create a user without the email", async (done) => {
    const res = await request(app)
      .post("/users")
      .send({ name: "Not Create User", password: "passwordUser" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Data is missing for user creation.");
    done();
  });

  it("Should not create a user without the password", async (done) => {
    const res = await request(app)
      .post("/users")
      .send({ name: "Not Create User", email: "not_create_user@mail.com" })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Data is missing for user creation.");
    done();
  });

  it("Should not create a user with an existing email", async (done) => {
    const res = await request(app)
      .post("/users")
      .send({
        username: "another_user_test",
        name: "Another User Test",
        email: "user_test@mail.com",
        password: "AnotherUserTest",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("A user with this email already exists.");
    done();
  });

  it("Should update an user by id", async (done) => {
    const res = await request(app)
      .put(`/users/${user[0].id}`)
      .send({
        name: "User Test Update",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    done();
  });

  it("Should delete an user by id", async (done) => {
    const res = await request(app)
      .delete(`/users/${user[0].id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);

    const response = await request(app)
      .delete(`/users/${secondaryUser[0].id}`)
      .set("Authorization", `Bearer ${secondaryToken}`);

    expect(response.status).toBe(204);
    done();
  });
});
