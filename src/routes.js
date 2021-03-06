import { Router } from "express";
import path from "path";
import authMiddleware from "./middlewares/auth";
import UsersController from "./controllers/UsersController";
import AccountsController from "./controllers/AccountsController";
import AuthController from "./controllers/AuthController";
import TransactionsController from "./controllers/TransactionsController";
import TransfersController from "./controllers/TransfersController";

const routes = new Router();

routes.get("/", function (req, res) {
  // eslint-disable-next-line no-undef
  res.sendFile(path.join(__dirname + "/index.html"));
});

routes.post("/auth/signin", AuthController.create);
routes.post("/auth/signup", UsersController.create);

routes.use(authMiddleware);
routes.get("/users", UsersController.getAll);
routes.get("/users/:id", UsersController.getById);
routes.post("/users", UsersController.create);
routes.put("/users/:id", UsersController.update);
routes.delete("/users/:id", UsersController.delete);

routes.get("/accounts", AccountsController.getAll);
routes.get("/accounts/:id", AccountsController.getById);
routes.post("/accounts", AccountsController.create);
routes.put("/accounts/:id", AccountsController.update);
routes.delete("/accounts/:id", AccountsController.delete);

routes.get("/transactions", TransactionsController.getAll);
routes.get("/user/transactions", TransactionsController.getUserTransactions);
routes.get("/transactions/:id", TransactionsController.getById);
routes.post("/transactions", TransactionsController.create);
routes.put("/transactions/:id", TransactionsController.update);
routes.delete("/transactions/:id", TransactionsController.delete);

routes.get("/transfers", TransfersController.getAll);
routes.get("/user/transfers", TransfersController.getUserTransfers);
routes.get("/transfers/:id", TransfersController.getById);
routes.post("/transfers", TransfersController.create);
routes.put("/transfers/:id", TransfersController.update);
routes.delete("/transfers/:id", TransfersController.delete);

export default routes;
