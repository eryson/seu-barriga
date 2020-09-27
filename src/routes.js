import { Router } from "express";
import path from "path";
import UsersController from "./controllers/UsersController";
import AccountsController from "./controllers/AccountsController";

const routes = new Router();

routes.get("/", function (req, res) {
  // eslint-disable-next-line no-undef
  res.sendFile(path.join(__dirname + "/index.html"));
});

routes.get("/users", UsersController.getAll);
routes.post("/users", UsersController.create);

routes.get("/accounts", AccountsController.getAll);
routes.get("/accounts/:id", AccountsController.getById);
routes.post("/accounts", AccountsController.create);
routes.put("/accounts/:id", AccountsController.update);

export default routes;
