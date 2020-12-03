import knex from "../database";

class TransfersController {
  async getAll(req, res) {
    try {
      return res.status(200).json("transfers");
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const { authenticatedUserId } = req;

      const isUserTransfers = await knex("transfers")
        .join("users", "users.id", "user_id")
        .where({
          "users.id": authenticatedUserId,
          "transfers.id": id,
        })
        .select();

      if (isUserTransfers.length === 0) {
        return res
          .status(403)
          .json({ error: "Request not allowed for this user." });
      }

      const transfer = await knex("transfers").where({ id: id }).select();

      return res.status(200).json(transfer);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  async getUserTransfers(req, res) {
    try {
      const { authenticatedUserId } = req;

      const userTransfers = await knex("transfers")
        .join("users", "users.id", "user_id")
        .where({ "users.id": authenticatedUserId })
        .select();

      return res.status(200).json(userTransfers);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  async create(req, res) {
    try {
      const {
        description,
        date,
        ammount,
        acc_ori_id,
        acc_dest_id,
        user_id,
      } = req.body;

      if (
        !description ||
        !date ||
        !ammount ||
        !acc_ori_id ||
        !acc_dest_id ||
        !user_id
      ) {
        return res
          .status(400)
          .json({ error: "Data is missing for creating the transfer." });
      }

      const transfer = await knex("transfers")
        .insert({
          description,
          date,
          ammount,
          acc_ori_id,
          acc_dest_id,
          user_id,
        })
        .returning([
          "id",
          "description",
          "date",
          "ammount",
          "acc_ori_id",
          "acc_dest_id",
          "user_id",
        ]);

      return res.status(201).json(transfer);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  //   async update(req, res) {
  //     try {
  //       const { id } = req.params;
  //       const { description, date, ammount, type, acc_id } = req.body;
  //       const { authenticatedUserId } = req;

  //       const isUserTransactions = await knex("transactions")
  //         .join("accounts", "accounts.id", "acc_id")
  //         .where({
  //           "accounts.user_id": authenticatedUserId,
  //           "transactions.id": id,
  //         })
  //         .select();

  //       if (isUserTransactions.length === 0) {
  //         return res
  //           .status(403)
  //           .json({ error: "Request not allowed for this user." });
  //       }

  //       if (!description && !date && !ammount && !type && !acc_id) {
  //         return res
  //           .status(400)
  //           .json({ error: "Data is missing for transaction update." });
  //       }

  //       const data = req.body;

  //       const transaction = await knex("transactions")
  //         .where({ id: id })
  //         .update({ ...data })
  //         .returning(["id", "description", "date", "ammount", "type", "acc_id"]);

  //       return res.status(200).json(transaction);
  //     } catch (error) {
  //       return res.status(400).json(error.message);
  //     }
  //   }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const { authenticatedUserId } = req;

      const isUserTransfers = await knex("transfers")
        .join("users", "users.id", "user_id")
        .where({
          "users.id": authenticatedUserId,
          "transfers.id": id,
        })
        .select();

      if (isUserTransfers.length === 0) {
        return res
          .status(403)
          .json({ error: "Request not allowed for this user." });
      }

      const transfer = await knex("transfers").where({ id: id }).delete();

      return res.status(204).json(transfer);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }
}

export default new TransfersController();
