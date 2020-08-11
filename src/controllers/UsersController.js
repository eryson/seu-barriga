class UsersController {
  async index(req, res) {
    try {
      const users = [{ name: "Jhon Doe", mail: "jhon@mail.com" }];
      return res.status(200).json(users);
    } catch (error) {
      return res.json(error);
    }
  }

  async create(req, res) {
    try {
      const users = req.body;
      return res.status(201).json(users);
    } catch (error) {
      return res.json(error);
    }
  }
}

export default new UsersController();
