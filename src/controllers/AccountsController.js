import knex from "../database";

class AccountsController {
  async getAll(req, res) {
    try {
      const accounts = await knex("accounts");

      return res.status(200).json(accounts);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const { authenticatedUserId } = req;

      const account = await knex("accounts").where({ id: id }).select();

      if (authenticatedUserId !== account[0].user_id) {
        return res
          .status(403)
          .json({ error: "Request not allowed for this user." });
      }

      return res.status(200).json(account);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  async create(req, res) {
    try {
      const { name, user } = req.body;

      if (!name || !user) {
        return res
          .status(400)
          .json({ error: "Data is missing for account creation." });
      }

      const accountExists = await knex("accounts").where({
        name: name,
        user_id: user,
      });

      if (accountExists.length > 0) {
        return res
          .status(400)
          .json({ error: "This account already exists for this user." });
      }

      const account = await knex("accounts")
        .insert({
          name,
          user_id: user,
        })
        .returning("id");

      return res.status(201).json(account);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const { authenticatedUserId } = req;

      const hasAccount = await knex("accounts").where({ id: id }).select();

      if (authenticatedUserId !== hasAccount[0].user_id) {
        return res
          .status(403)
          .json({ error: "Request not allowed for this user." });
      }

      const account = await knex("accounts")
        .where({ id: id })
        .update({ name: name });

      return res.status(200).json(account);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const { authenticatedUserId } = req;

      const hasTransactions = await knex("transactions")
        .join("accounts", "accounts.id", "acc_id")
        .where({
          "accounts.user_id": authenticatedUserId,
          "transactions.id": id,
        })
        .select();

      if (hasTransactions.length > 0) {
        return res.status(403).json({
          error:
            "This account could not be deleted because it has transactions.",
        });
      }

      const hasAccount = await knex("accounts").where({ id: id }).select();

      if (authenticatedUserId !== hasAccount[0].user_id) {
        return res
          .status(403)
          .json({ error: "Request not allowed for this user." });
      }

      const account = await knex("accounts").where({ id: id }).delete();

      return res.status(204).json(account);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }
}

export default new AccountsController();
