import { Router } from "express";
import UsersController from "./controllers/UsersController";

const routes = new Router();

routes.get("/", function (req, res) {
  res.send("It's Running!!!");
});
routes.get("/users", UsersController.index);

export default routes;
