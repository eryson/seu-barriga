import request from "supertest";
import app from "../../src/app";

it("Should respond at the root", async (done) => {
  const res = await request(app).get("/");
  expect(res.status).toBe(200);
  done();
});
