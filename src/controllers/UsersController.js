class UsersController {
  async index(req, res) {
    try {
      const users = [{ name: "Jhon Doe", mail: "jhon@mail.com" }];
      return res.json(users);
    } catch (error) {
      return res.json(error);
    }
  }
}

export default new UsersController();
