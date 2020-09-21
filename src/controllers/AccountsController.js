import knex from "../database";

class AccountsController {
  async create(req, res) {
    try {
      const { name, user_id } = req.body;

      if (!name || !user_id) {
        return res
          .status(400)
          .json({ error: "Data is missing for user creation." });
      }

      const account = await knex("accounts").where({ user_id: user_id });

      if (account.length > 0) {
        return res.status(400).json({ error: "This account already exists." });
      }

      await knex("accounts").insert({
        name,
        user_id,
      });

      return res.status(201).json(account);
    } catch (error) {
      return res.json(error);
    }
  }
}

export default new AccountsController();
