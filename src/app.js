require("dotenv").config({});

import express from "express";
import "express-async-errors";
import cors from "cors";
import "express-async-errors";
import routes from "./routes";
import path from "path";

class App {
  constructor() {
    this.server = express();
    this.midllewares();
    this.routes();
  }

  midllewares() {
    this.server.use(express.json());
    this.server.use(cors());
    // eslint-disable-next-line no-undef
    this.server.use(express.static(path.join(__dirname, "public")));

    this.server.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, GET, POST, DELETE, OPTIONS"
      );
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      res.header("Access-Control-Allow-Credentials", "true");
      next();
    });
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
