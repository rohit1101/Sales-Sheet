const { Pool, Client } = require("pg");

const newPool = new Pool({
  user: "admin",
  host: "localhost",
  database: "sales_api",
  password: "password",
  port: 5432,
});
console.log(newPool);
