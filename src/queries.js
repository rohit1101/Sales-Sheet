const { Pool, Client } = require("pg");
const { USER, PASSWORD, HOST, PORT, DATABASE } = require("../config");

const newPool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});
console.log(newPool);
