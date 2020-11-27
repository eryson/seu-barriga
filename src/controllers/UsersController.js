import knex from "../database";
import bcrypt from "bcrypt";

class UsersController {
  async getAll(req, res) {
    try {
      const users = await knex("users").select(["id", "name", "email"]);
      return res.status(200).json(users);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await knex("users").where({ id: id }).select();

      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  async create(req, res) {
    try {
      const { username, name, email, password } = req.body;

      if (!username || !name || !email || !password) {
        return res
          .status(400)
          .json({ error: "Data is missing for user creation." });
      }

      const userExists = await knex("users").where({ email: email });

      if (userExists.length > 0) {
        return res
          .status(400)
          .json({ error: "A user with this email already exists." });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await knex("users")
        .insert({
          username,
          name,
          email,
          password: passwordHash,
        })
        .returning(["id", "name", "email", "password"]);

      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      if (!name && !email && !password) {
        return res
          .status(400)
          .json({ error: "Data is missing for user update." });
      }

      const data = req.body;

      if (data.password) {
        data.password = await bcrypt.hash(password, 10);
      }

      const user = await knex("users")
        .where({ id: id })
        .update({ ...data });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const user = await knex("users").where({ id: id }).delete();

      return res.status(204).json(user);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }
}

export default new UsersController();
