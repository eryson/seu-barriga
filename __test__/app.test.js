const request = require("supertest");
const app = require("../src/app");

test("Should respond at the root", async () => {
  const res = await request(app).get("/");
  return expect(res.status).toBe(200);
});
