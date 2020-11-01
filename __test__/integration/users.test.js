import request from "supertest";
import app from "../../src/app";
import generateToken from "../../src/utils/generateToken";

const testToken = generateToken();
let user;

describe("Users Tests", () => {
  const email = `${Date.now()}@mail.com`;

  it("Should create a user", async (done) => {
    const res = await request(app)
      .post("/users")
      .send({ name: "Stormtroopers", email, password: "GalacticEmpire" })
      .set("Authorization", `Bearer ${testToken}`);

    user = res.body;
    expect(res.status).toBe(201);
    done();
  });

  it("Should return all users", async (done) => {
    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body).not.toHaveProperty("password");
    done();
  });

  it("Should return an user by id", async (done) => {
    const res = await request(app)
      .get(`/users/${user[0].id}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe("Stormtroopers");
    expect(res.body.length).toBe(1);
    done();
  });

  it("Should encrypt the user password", async (done) => {
    const emailHash = `${Date.now()}@mail.com`;
    const res = await request(app)
      .post("/users")
      .send({
        name: "Stormtroopers Hash Password",
        email: emailHash,
        password: "GalacticEmpire",
      })
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.status).toBe(201);
    expect(res.body.password).not.toBe("GalacticEmpire");
    done();
  });

  it("Should not create a user without the name", async (done) => {
    const email = `${Date.now()}@mail.com`;
    const res = await request(app)
      .post("/users")
      .send({ email, password: "GalacticEmpire" })
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Data is missing for user creation.");
    done();
  });

  it("Should not create a user without the email", async (done) => {
    const res = await request(app)
      .post("/users")
      .send({ name: "Palpatine", password: "GalacticEmpire" })
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Data is missing for user creation.");
    done();
  });

  it("Should not create a user without the password", async (done) => {
    const email = `${Date.now()}@mail.com`;
    const res = await request(app)
      .post("/users")
      .send({ name: "Rey", email })
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Data is missing for user creation.");
    done();
  });

  it("Should not create a user with an existing email", async (done) => {
    const res = await request(app)
      .post("/users")
      .send({ name: "Kylo", email, password: "GalacticEmpire" })
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("A user with this email already exists.");
    done();
  });

  it("Should update an user by id", async (done) => {
    const res = await request(app)
      .put(`/users/${user[0].id}`)
      .send({
        name: "Stormtroopers Update",
        password: "GalacticEmpireUpdate",
      })
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.status).toBe(200);
    done();
  });

  it("Should delete an user by id", async (done) => {
    const res = await request(app)
      .delete(`/users/${user[0].id}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.status).toBe(204);
    done();
  });
});
