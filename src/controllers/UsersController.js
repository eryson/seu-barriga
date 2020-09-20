import knex from "../database";

class UsersController {
  async index(req, res) {
    try {
      const users = await knex("users");
      return res.status(200).json(users);
    } catch (error) {
      return res.json(error);
    }
  }

  async create(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ error: "Data is missing for user creation." });
      }

      const user = await knex("users").insert({
        name,
        email,
        password,
      });
      return res.status(201).json(user);
    } catch (error) {
      return res.json(error);
    }
  }
}

export default new UsersController();
