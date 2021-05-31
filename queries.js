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
      .query(`SELECT * FROM sales where date(date) = $1 and card_id=$2`, [
        date,
        parseInt(cardId),
      ])
      .then((result) => res.send(result.rows))
      .catch((e) => console.log("error", e));
  }
  if (cardId) {
    return pool
      .query(`SELECT * FROM sales where card_id = $1`, [cardId])
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
  const { card_id, sales_rep_id, date, amount_paid } = req.body;
  console.log(card_id, sales_rep_id, date, amount_paid);
  if (Object.keys(req.body).length === 3) {
    return pool
      .query(
        "insert into sales(card_id,sales_rep_id,amount_paid)values($1,$2,$3)",
        [parseInt(card_id), sales_rep_id, parseFloat(amount_paid)]
      )
      .then(() => res.json(req.body))
      .catch((e) => console.log("error", e));
  }
  if (Object.keys(req.body).length === 4) {
    return pool
      .query(
        "insert into sales(card_id,sales_rep_id,date,amount_paid)values($1,$2,$3,$4)",
        [parseInt(card_id), sales_rep_id, date, parseFloat(amount_paid)]
      )
      .then(() => res.json(req.body))
      .catch((e) => console.log("error", e));
  } else {
    res.status(400).send("Bad Request");
  }
};

exports.updateSalesEntry = (req, res) => {
  console.log(req.params, req.body);
  const { id } = req.params;
  const { card_id } = req.body;
  return pool
    .query("update sales set card_id=$1 where id=$2", [card_id, id])
    .then(() => res.status(200).send(`Sales Entry modified with id:${id}`))
    .catch((e) => console.log("Error PUT request =>", e));
};

exports.deleteSalesEntry = (req, res) => {
  console.log(req.params, req.body);
  const { id } = req.params;
  return pool
    .query("delete from sales where id=$1", [id])
    .then(() => res.status(200).send(`Deleted an entry with id:${id}`))
    .catch((e) => console.log("Error DELETE request =>", e));
};
