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
      return res.status(201).json("create");
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
      return res.status(204).json("delete");
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }
}

export default new UsersController();
