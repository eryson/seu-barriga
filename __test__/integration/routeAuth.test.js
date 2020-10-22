import request from "supertest";
import app from "../../src/app";

describe("Routes Authentication Tests", () => {
  it("Should not be able to access private routes without jwt token", async () => {
    const response = await request(app).delete("/users");

    expect(response.status).toBe(400);
  });
});
