/* eslint-disable no-undef */
export const client = "pg";
export const version = "12";
export const connection = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};
export const migrations = {
  directory: "src/database/migrations",
};
