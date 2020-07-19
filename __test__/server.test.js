const supertest = require("supertest");
const request = supertest("http://localhost:3001");

test("Should respond on port 3001", async () => {
  const res = await request.get("/");
  return expect(res.status).toBe(200);
});
