import request from "supertest";
import app from "../../src/app";
import generateToken from "../../src/utils/generateToken";

const testToken = generateToken();
let user;

describe("Auth Tests", () => {
  it("Should create a user via signup", async (done) => {
    const res = await request(app).post("/auth/signup").send({
      username: "user",
      name: "User Signup",
      email: "user.signup@mail.com",
      password: "userSignup",
    });

    user = res.body;
    expect(res.status).toBe(201);
    expect(res.body[0].name).toBe("User Signup");
    expect(res.body[0].email).toBe("user.signup@mail.com");
    done();
  });

  it("Should return jwt token when authenticated", async (done) => {
    const auth = await request(app).post("/auth/signin").send({
      email: user[0].email,
      password: "userSignup",
    });

    expect(auth.body).toHaveProperty("token");
    done();
  });

  it("Should not authenticated when wrong password", async (done) => {
    const auth = await request(app).post("/auth/signin").send({
      email: user[0].email,
      password: "wrongPassword",
    });

    expect(auth.status).toBe(401);
    expect(auth.body.message).toBe("incorrect username or password");
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

  it("Should not be able to access private routes without jwt token", async (done) => {
    const response = await request(app).delete("/users");

    expect(response.status).toBe(400);

    const res = await request(app)
      .delete(`/users/${user[0].id}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(res.status).toBe(204);
    done();
  });
});
