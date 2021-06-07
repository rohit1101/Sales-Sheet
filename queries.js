const pg = require("pg");
const { URL, URLSearchParams } = require("url");

const { Pool } = pg;

const pool = new Pool({
  user: "MSD",
  host: "localhost",
  database: "postgres",
  password: "done",
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
  const { card_id, sales_rep_id, date, amount_paid, description } = req.body;
  console.log(card_id, sales_rep_id, date, amount_paid, description);
  if (Object.keys(req.body).length === 4) {
    return pool
      .query(
        "insert into sales(card_id,sales_rep_id,amount_paid,description)values($1,$2,$3,$4) returning *",
        [parseInt(card_id), sales_rep_id, parseFloat(amount_paid), description]
      )
      .then((result) => res.send(result.rows[0]))
      .catch((e) => console.log("error", e));
  }
  if (Object.keys(req.body).length === 5) {
    return pool
      .query(
        "insert into sales(card_id,sales_rep_id,date,amount_paid,description)values($1,$2,$3,$4,$5) returning *",
        [
          parseInt(card_id),
          sales_rep_id,
          date,
          parseFloat(amount_paid),
          description,
        ]
      )
      .then((result) => res.send(result.rows[0]))
      .catch((e) => console.log("error", e));
  } else {
    res.status(400).send("Bad Request");
  }
};

exports.updateSalesEntry = async (req, res) => {
  console.log(req.params, req.body);
  const { id } = req.params;
  const { date, amount_paid, description } = req.body;

  if (isNaN(id)) {
    return res.status(400).send("Invalid ID");
  }

  const doesIdExists = await pool
    .query("SELECT EXISTS(SELECT 1 FROM sales WHERE id = $1)", [parseInt(id)])
    .then((result) => result.rows[0].exists);

  if (doesIdExists) {
    if (amount_paid && date && description) {
      return pool
        .query(
          "update sales set amount_paid=$1, date=$2, description=$3 where id=$4",
          [amount_paid, date, description, id]
        )
        .then(() => res.status(200).send(`Sales Entry modified with id:${id}`))
        .catch((e) => console.log("Error PUT request =>", e));
    } else if (amount_paid && date) {
      return pool
        .query(
          "update sales set amount_paid=$1, date=$2,description=$3 where id=$4",
          [amount_paid, date, description, id]
        )
        .then(() => res.status(200).send(`Sales Entry modified with id:${id}`))
        .catch((e) => console.log("Error PUT request =>", e));
    } else if (date && description) {
      return pool
        .query("update sales set date=$1, description=$2 where id=$3", [
          date,
          description,
          id,
        ])
        .then(() => res.status(200).send(`Sales Entry modified with id:${id}`))
        .catch((e) => console.log("Error PUT request =>", e));
    } else if (amount_paid && description) {
      return pool
        .query("update sales set amount_paid=$1, description=$2 where id=$3", [
          amount_paid,
          description,
          id,
        ])
        .then(() => res.status(200).send(`Sales Entry modified with id:${id}`))
        .catch((e) => console.log("Error PUT request =>", e));
    } else if (date) {
      return pool
        .query("update sales set date=$1 where id=$2", [date, id])
        .then(() => res.status(200).send(`Sales Entry modified with id:${id}`))
        .catch((e) => console.log("Error PUT request =>", e));
    } else if (amount_paid) {
      return pool
        .query("update sales set amount_paid=$1,description=$2 where id=$2", [
          amount_paid,
          description,
          id,
        ])
        .then(() => res.status(200).send(`Sales Entry modified with id:${id}`))
        .catch((e) => console.log("Error PUT request =>", e));
    } else if (description) {
      return pool
        .query("update sales set description=$1 where id=$2", [description, id])
        .then(() => res.status(200).send(`Sales Entry modified with id:${id}`))
        .catch((e) => console.log("Error PUT request =>", e));
    }
  } else {
    return res.status(400).send("ID does not exist");
  }
};

exports.deleteSalesEntry = async (req, res) => {
  console.log(req.params);
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).send("Invalid ID");
  }

  const doesIdExists = await pool
    .query("SELECT EXISTS(SELECT 1 FROM sales WHERE id = $1)", [parseInt(id)])
    .then((result) => result.rows[0].exists);

  if (doesIdExists) {
    return pool
      .query("delete from sales where id=$1", [parseInt(id)])
      .then(() => res.status(200).send(`Deleted an entry with id:${id}`))
      .catch((e) => console.log("Error DELETE request =>", e));
  } else {
    return res.status(400).send("ID does not exist");
  }
};
