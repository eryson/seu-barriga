const express = require("express");
const app = express();
const consign = require("consign");

consign({ cwd: "src", verbose: false })
  .include("./middlewares/bodyParser.js")
  .into(app);

app.get("/", (req, res) => {
  res.status(200).send();
});

app.get("/users", (req, res) => {
  const users = [{ name: "Jhon Doe", mail: "jhon@mail.com" }];
  res.status(200).json(users);
});

app.post("/users", (req, res) => {
  res.status(201).json(req.body);
});

// eslint-disable-next-line no-undef
module.exports = app;
