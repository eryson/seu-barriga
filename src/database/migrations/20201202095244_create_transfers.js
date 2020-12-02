/* eslint-disable no-undef */
exports.up = (knex) => {
  return knex.schema.createTable("transfers", (t) => {
    t.increments("id").primary();
    t.string("description").notNull();
    t.date("date").notNull();
    t.decimal("ammount", 15, 2).notNull();
    t.integer("acc_ori_id").references("id").inTable("accounts").notNull();
    t.integer("acc_dest_id").references("id").inTable("accounts").notNull();
    t.integer("user_id").references("id").inTable("users").notNull();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("transfers");
};
