const pg = require("pg");
const { URL, URLSearchParams } = require("url");

const { Pool } = pg;

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
      .then((result) => res.send(result.rows))
      .catch((e) => console.log("error", e));
  }
  if (cardId) {
    return pool
      .query(`SELECT * FROM sales where cardid = $1`, [cardId])
      .then((result) => res.send(result.rows))
      .catch((e) => console.log("error", e));
  }
  if (date) {
    return pool
      .query(`SELECT * FROM sales where date(date) = $1`, [date])
      .then((result) => res.send(result.rows))
      .catch((e) => console.log("error", e));
  } else {
    return pool
      .query(`SELECT * FROM sales`)
      .then((result) => res.send(result.rows))
      .catch((e) => console.log("error", e));
  }
};

exports.addSalesEntry = (req, res) => {
  const { cardId, salesRepId, date, amount } = req.body;
  console.log(cardId, salesRepId, date, salesRepId);
  if (Object.keys(req.body).length === 3) {
    return pool
      .query(
        "insert into sales(cardid,salesrepid,amountpaid)values($1,$2,$3)",
        [parseInt(cardId), salesRepId, parseFloat(amount)]
      )
      .then(() => res.json(req.body))
      .catch((e) => console.log("error", e));
  }
  if (Object.keys(req.body).length === 4) {
    return pool
      .query(
        "insert into sales(cardid,salesrepid,date,amountpaid)values($1,$2,$3,$4)",
        [parseInt(cardId), salesRepId, date, parseFloat(amount)]
      )
      .then(() => res.json(req.body))
      .catch((e) => console.log("error", e));
  } else {
    res.status(400).send("Bad Request");
  }
};
