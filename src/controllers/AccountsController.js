import knex from "../database";

class AccountsController {
  async getAll(req, res) {
    try {
      const accounts = await knex("accounts");
      return res.status(200).json(accounts);
    } catch (error) {
      return res.json(error);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const account = await knex("accounts").where({ id: id }).select();
      return res.status(200).json(account);
    } catch (error) {
      return res.json(error);
    }
  }

  async create(req, res) {
    try {
      const { name, user_id } = req.body;

      if (!name || !user_id) {
        return res
          .status(400)
          .json({ error: "Data is missing for user creation." });
      }

      const accountExists = await knex("accounts").where({ user_id: user_id });

      if (accountExists.length > 0) {
        return res.status(400).json({ error: "This account already exists." });
      }

      const account = await knex("accounts")
        .insert({
          name,
          user_id,
        })
        .returning("id");

      return res.status(201).json(account);
    } catch (error) {
      return res.json(error);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const account = await knex("accounts")
        .where({ id: id })
        .update({ name: name });
      return res.status(200).json(account);
    } catch (error) {
      return res.json(error);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const account = await knex("accounts").where({ id: id }).delete();
      return res.status(204).json(account);
    } catch (error) {
      return res.json(error);
    }
  }
}

export default new AccountsController();
