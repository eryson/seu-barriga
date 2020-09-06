/* eslint-disable no-undef */
module.exports = {
  test: {
    client: "pg",
    version: "12",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: "src/database/migrations",
    },
  },
};
