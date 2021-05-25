const { Pool, Client } = require("pg");

const newPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
console.log(newPool);

module.exports = { newPool: newPool };
