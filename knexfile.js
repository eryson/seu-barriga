// Update with your config settings.

// eslint-disable-next-line no-undef
module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "localhost",
      user: "postgres",
      password: "admin",
      database: "seu-barriga",
    },
    migrations: {
      directory: "src/database/migrations",
    },
    seeds: {
      directory: "src/database/seeds",
    },
  },
};
