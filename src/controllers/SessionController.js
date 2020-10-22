import knex from "../database";
import comparePassword from "../utils/comparePassword";
import generateToken from "../utils/generateToken";

class SessionController {
  async create(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Data is missing for user auth." });
      }

      const userExists = await knex("users").where({ email: email });

      if (userExists.length < 0) {
        return res.status(400).json({ error: "user does not exists" });
      } else {
        const compareHash = await comparePassword(
          password,
          userExists[0].password
        );

        if (!compareHash) {
          return res
            .status(401)
            .json({ message: "incorrect username or password" });
        }
      }

      return res.json({
        userExists,
        token: generateToken({ id: userExists.id, admin: userExists.admin }),
      });
    } catch (error) {
      return res.json(error);
    }
  }
}

export default new SessionController();
