// eslint-disable-next-line no-undef
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          username: "admin",
          name: "Admin",
          email: "admin@mail.com",
          password: "12345",
        },
      ]);
    });
};
