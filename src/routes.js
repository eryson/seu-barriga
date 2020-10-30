import { Router } from "express";
import path from "path";
import authMiddleware from "./middlewares/auth";
import UsersController from "./controllers/UsersController";
import AccountsController from "./controllers/AccountsController";
import AuthController from "./controllers/AuthController";

const routes = new Router();

routes.get("/", function (req, res) {
  // eslint-disable-next-line no-undef
  res.sendFile(path.join(__dirname + "/index.html"));
});

routes.post("/auth/signin", AuthController.create);
routes.post("/auth/signup", UsersController.create);

routes.use(authMiddleware);
routes.get("/users", UsersController.getAll);
routes.post("/users", UsersController.create);

routes.get("/accounts", AccountsController.getAll);
routes.get("/accounts/:id", AccountsController.getById);
routes.post("/accounts", AccountsController.create);
routes.put("/accounts/:id", AccountsController.update);
routes.delete("/accounts/:id", AccountsController.delete);

export default routes;
