// eslint-disable-next-line no-undef
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        { name: "Eryson", email: "eryson@mail.com", password: "123" },
        { name: "Ana", email: "ana@mail.com", password: "456" },
      ]);
    });
};
