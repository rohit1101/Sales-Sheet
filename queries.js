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
  const { id, date } = req.query;
  console.log(req.query);
  if (id) {
    pool
      .query(`SELECT * FROM sales_api where user_id = $1`, [id])
      .then((result) => res.send(result.rows))
      .catch((e) => console.log("error", e));
  }
  if (date) {
    console.log(date);
    pool
      .query(`SELECT * FROM sales_api where date(date) = $1`, [date])
      .then((result) => {
        console.log(result.rows);
        res.send(result.rows);
      })
      .catch((e) => console.log("error", e));
  } else {
    pool
      .query(`SELECT * FROM sales_api`)
      .then((result) => res.send(result.rows))
      .catch((e) => console.log("error", e));
  }
};

exports.addNewSalesEntry = (req, res) => {
  const { userId, salesId } = req.params;
  pool
    .query(
      "insert into sales_api(card_id,user_id,amount_paid,expense)values($1,$2,$3,$4)",
      [userId, salesId, 20, 5]
    )
    .then(() => res.send(`Added a new sales entry with salesId: ${salesId}`))
    .catch((e) => e);
};

function whereClause(attribute, value) {
  return `SELECT * FROM sales_api where user_id = $1`, [value];
}
