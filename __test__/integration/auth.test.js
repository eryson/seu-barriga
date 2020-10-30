import request from "supertest";
import app from "../../src/app";
import generateToken from "../../src/utils/generateToken";
import jwt from "jsonwebtoken";

const testToken = generateToken();

describe("Auth Tests", () => {
  it("Should create a user via signup", async (done) => {
    const email = `${Date.now()}@mail.com`;

    const res = await request(app)
      .post("/auth/signup")
      .send({ name: "User Signup", email, password: "userSignup" });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("User Signup");
    expect(res.body.email).toHaveProperty(email);
    done();
  });

  it("Should return jwt token when authenticated", async (done) => {
    const email = `${Date.now()}@mail.com`;

    const res = await request(app)
      .post("/users")
      .send({ name: "User Authenticated", email, password: "haveToken" })
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.status).toBe(201);

    const auth = await request(app).post("/auth/signin").send({
      email,
      password: "haveToken",
    });

    expect(auth.body).toHaveProperty("token");
    done();
  });

  it("Should not authenticated when wrong password", async (done) => {
    const email = `${Date.now()}@mail.com`;

    const res = await request(app)
      .post("/users")
      .send({ name: "User Authenticated", email, password: "haveToken" })
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.status).toBe(201);

    const auth = await request(app).post("/auth/signin").send({
      email,
      password: "wrongPassword",
    });

    expect(auth.status).toBe(401);
    expect(auth.body.error).toBe("incorrect username or password");
    done();
  });

  it("Should not authenticated when user does not exists", async (done) => {
    const auth = await request(app).post("/auth/signin").send({
      email: "user_not_exists@mail.com",
      password: "wrongPassword",
    });

    expect(auth.status).toBe(400);
    expect(auth.body.error).toBe("user does not exists");
    done();
  });

  it("Should not be able to access private routes without jwt token", async () => {
    const response = await request(app).delete("/users");

    expect(response.status).toBe(400);
  });
});
