/* eslint-disable no-undef */
module.exports = {
  test: {
    client: "pg",
    version: "12",
    // connection: "postgres://postgres:admin@localhost/seu-barriga",
    connection: {
      host: "localhost",
      user: "postgres",
      password: "admin",
      database: "seu-barriga",
    },
    migrations: {
      directory: "src/database/migrations",
    },
  },
};
