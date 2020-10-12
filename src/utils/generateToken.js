const jwt = require("jsonwebtoken");

export default function generateToken(params = {}) {
  return jwt.sign(params, process.env.APP_SECRET, {
    expiresIn: "5h",
  });
}
