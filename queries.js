const pg = require("pg");
const { Pool, Client } = pg;

const pool = new Pool({
  user: "admin",
  host: "localhost",
  database: "sales_api",
  password: "password",
  port: "5432",
});

exports.getAllSales = (req, res) => {
  const { id, date } = req.query;

  if (id && date) {
    return pool
      .query(`SELECT * FROM sales_api where date(date) = $1 and user_id=$2`, [
        date,
        id,
      ])
      .then((result) =>
        result.rows.length ? res.send(result.rows) : res.send("No data found")
      )
      .catch((e) => console.log("error", e));
  }
  if (id) {
    return pool
      .query(`SELECT * FROM sales_api where user_id = $1`, [id])
      .then((result) =>
        result.rows.length ? res.send(result.rows) : res.send("No data found")
      )
      .catch((e) => console.log("error", e));
  }
  if (date) {
    return pool
      .query(`SELECT * FROM sales_api where date(date) = $1`, [date])
      .then((result) =>
        result.rows.length ? res.send(result.rows) : res.send("No data found")
      )
      .catch((e) => console.log("error", e));
  } else {
    return pool
      .query(`SELECT * FROM sales_api`)
      .then((result) =>
        result.rows.length ? res.send(result.rows) : res.send("No data found")
      )
      .catch((e) => console.log("error", e));
  }
};

exports.addSalesEntry = (req, res) => {
  if (Object.keys(req.body).length === 5) {
    const { saleId, userId, date, amountPaid, expense } = req.body;
    pool
      .query(
        "insert into sales_api(card_id,user_id,date,amount_paid,expense)values($1,$2,$3,$4,$5)",
        [saleId, userId, date, parseFloat(amountPaid), parseFloat(expense)]
      )
      .then(() => res.json(req.body))
      .catch((e) => console.log("error", e));
  } else {
    res.status(400).send("Bad Request");
  }
};

// user_id      |            date

// user_44xczs  | 2021-05-20 21:49:09.020704 |
// user_549dsds | 2021-05-25 10:51:21.890662 |
// user_sdse222 | 2021-05-25 00:00:00        |
// 00fdxb21e    | 2021-05-25 17:53:22.134371 |
// 00fdxb21e    | 2021-05-25 17:57:23.475088 |
// 00fdxb21e    | 2021-05-25 18:06:08.787216 |
