const pg = require("pg");
const { Pool, Client } = pg;

// NODE_ENV=development
// DB_USER=admin
// DB_PASSWORD=password
// DB_HOST=localhost
// DB_PORT=5432
// DB_DATABASE=sales_api

const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "sales_api",
  password: "password",
  port: "5432",
});

exports.getAllSales = (req, res) => {
  return pool
    .query(`SELECT * FROM sales_api`)
    .then((result) => res.send(result.rows))
    .catch((e) => e);
};

exports.addNewSalesEntry = (req, res) => {
  const { userId, salesId } = req.params;
  console.log(typeof userId);
  return pool
    .query(
      "insert into sales_api(card_id,user_id,amount_paid,expense)values($1,$2,$3,$4)",
      [userId, salesId, 20, 5]
    )
    .then((result) =>
      res.send(`Added a new sales entry with salesId: ${salesId}`)
    )
    .catch((e) => e);
};
