import knex from "../database";
import comparePassword from "../utils/comparePassword";
import generateToken from "../utils/generateToken";

class AuthController {
  async create(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Data is missing for user auth." });
      }

      const user = await knex("users").where({ email: email });

      if (user.length <= 0) {
        return res.status(400).json({ error: "user does not exists" });
      } else {
        const compareHash = await comparePassword(password, user[0].password);

        if (!compareHash) {
          return res
            .status(401)
            .json({ message: "incorrect username or password" });
        }
      }

      return res.json({
        user,
        token: generateToken({ id: user[0].id }),
      });
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }
}

export default new AuthController();
