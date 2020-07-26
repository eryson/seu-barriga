import { Router } from "express";
import UsersController from "./controllers/UsersController";

const routes = new Router();

routes.get("/users", UsersController.index);

export default routes;
