import knex from "../database";

class UsersController {
  async getAll(req, res) {
    try {
      return res.status(200).json("getAll");
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  async getById(req, res) {
    try {
      const { authenticatedUserId } = req;

      const userTransactions = await knex("transactions")
        .join("accounts", "accounts.id", "acc_id")
        .where({ "accounts.user_id": authenticatedUserId })
        .select();

      return res.status(200).json(userTransactions);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  async create(req, res) {
    try {
      const { description, date, ammount, type, acc_id } = req.body;

      if (!description || !date || !ammount || !type || !acc_id) {
        return res
          .status(400)
          .json({ error: "Data is missing for creating the transaction." });
      }

      const transaction = await knex("transactions")
        .insert({
          description,
          date,
          ammount,
          type,
          acc_id,
        })
        .returning(["id", "description", "date", "ammount", "type", "acc_id"]);

      return res.status(201).json(transaction);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  async update(req, res) {
    try {
      return res.status(200).json("update");
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const { authenticatedUserId } = req;

      const isUserTransactions = await knex("transactions")
        .join("accounts", "accounts.id", "acc_id")
        .where({ "accounts.user_id": authenticatedUserId })
        .select();

      if (!isUserTransactions) {
        return res
          .status(403)
          .json({ error: "Request not allowed for this user." });
      }

      const transaction = await knex("transactions").where({ id: id }).delete();

      return res.status(204).json(transaction);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }
}

export default new UsersController();
