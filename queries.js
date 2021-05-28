const pg = require("pg");
const { Pool, Client } = pg;

const pool = new Pool({
  user: "MSD",
  host: "localhost",
  database: "postgres",
  password: "",
  port: "5432",
});

exports.getAllSales = (req, res) => {
  const { cardId, date } = req.query;

  if (cardId && date) {
    return pool
      .query(`SELECT * FROM sales where date(date) = $1 and cardid=$2`, [
        date,
        parseInt(cardId),
      ])
      .then((result) =>
        result.rows.length ? res.send(result.rows) : res.send("No data found")
      )
      .catch((e) => console.log("error", e));
  }
  if (cardId) {
    return pool
      .query(`SELECT * FROM sales where cardid = $1`, [cardId])
      .then((result) =>
        result.rows.length ? res.send(result.rows) : res.send("No data found")
      )
      .catch((e) => console.log("error", e));
  }
  if (date) {
    return pool
      .query(`SELECT * FROM sales where date(date) = $1`, [date])
      .then((result) =>
        result.rows.length ? res.send(result.rows) : res.send("No data found")
      )
      .catch((e) => console.log("error", e));
  } else {
    return pool
      .query(`SELECT * FROM sales`)
      .then((result) =>
        result.rows.length ? res.send(result.rows) : res.send("No data found")
      )
      .catch((e) => console.log("error", e));
  }
};

exports.addSalesEntry = (req, res) => {
  if (Object.keys(req.body).length === 3) {
    const { cardId, salesRepId, date, amountPaid } = req.body;
    pool
      .query(
        "insert into sales(cardid,salesrepid,amountpaid)values($1,$2,$3)",
        [cardId, salesRepId, parseFloat(amountPaid)]
      )
      .then(() => res.json(req.body))
      .catch((e) => console.log("error", e));
  } else {
    res.status(400).send("Bad Request");
  }
};
