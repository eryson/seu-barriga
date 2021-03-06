exports.up = function (knex) {
  return knex.schema.table("transactions", function (t) {
    t.integer("transfer_id")
      .references("id")
      .inTable("transfers")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.table("transactions", function (t) {
    t.dropColumn("transfer_id");
  });
};
