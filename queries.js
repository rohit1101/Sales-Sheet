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
  const { card_id, sales_rep_id, date, amount_paid } = req.body;
  console.log(card_id, sales_rep_id, date, amount_paid);
  if (Object.keys(req.body).length === 3) {
    return pool
      .query(
        "insert into sales(card_id,sales_rep_id,amount_paid)values($1,$2,$3) returning *",
        [parseInt(card_id), sales_rep_id, parseFloat(amount_paid)]
      )
      .then((result) => res.send(result.rows[0]))
      .catch((e) => console.log("error", e));
  }
  if (Object.keys(req.body).length === 4) {
    return pool
      .query(
        "insert into sales(card_id,sales_rep_id,date,amount_paid)values($1,$2,$3,$4) returning *",
        [parseInt(card_id), sales_rep_id, date, parseFloat(amount_paid)]
      )
      .then((result) => res.send(result.rows[0]))
      .catch((e) => console.log("error", e));
  } else {
    res.status(400).send("Bad Request");
  }
};

exports.updateSalesEntry = async (req, res) => {
  const { id } = req.params;
  const { date, amount_paid, card_id } = req.body;
  let dbArgs = [];
  amount_paid && dbArgs.push(parseFloat(amount_paid));
  date && dbArgs.push(date);
  card_id && dbArgs.push(parseInt(card_id));

  let query = `update sales set 
  ${amount_paid ? "amount_paid = $1" : ""}
  ${date ? "date = $2" : ""}
  ${card_id ? "card_id = $3" : ""}
  where id=${id};`.trim();

  console.log(query, dbArgs);

  if (isNaN(id)) {
    return res.status(400).send("Invalid ID");
  }

  // const doesIdExists = await pool
  //   .query("SELECT EXISTS(SELECT 1 FROM sales WHERE id = $1)", [parseInt(id)])
  //   .then((result) => result.rows[0].exists);

  // if (doesIdExists) {
  //   return pool
  //     .query(query, dbArgs)
  //     .then(() => res.status(200).send(`Sales Entry modified with id:${id}`))
  //     .catch((e) => console.log("Error PUT request =>", e));
  // } else {
  //   return res.status(400).send("ID does not exist");
  // }
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

exports.filterSales = (req, res) => {
  const { by } = req.query;
  console.log(by);
  if (Object.keys(req.query).length > 1) {
    const { start, end } = req.query;
    return pool
      .query(
        `select card_id,date,amount_paid from sales where date(date) >= $1 and date(date) <$2`,
        [start, end]
      )
      .then((result) => res.send(result.rows))
      .catch((e) => console.log("ERROR while filtering:", e));
  }
  return by === "date"
    ? pool
        .query(
          `select date(date),sum(amount_paid) from sales group by date(date)`
        )
        .then((result) => res.send(result.rows))
        .catch((e) => console.log("ERROR while filtering:", e))
    : pool
        .query(`select card_id,sum(amount_paid) from sales group by card_id`)
        .then((result) => res.send(result.rows))
        .catch((e) => console.log("ERROR while filtering:", e));
};

exports.getAllExpenses = (req, res) => {
  return pool
    .query(`select * from expenses`)
    .then((result) => res.send(result.rows))
    .catch((e) => console.log("Error while querying GET expenses"));
};

exports.addExpenseEntry = (req, res) => {
  const { sales_rep_id, date, amount_paid, description } = req.body;
  console.log(sales_rep_id, date, amount_paid, description);
  if (Object.keys(req.body).length === 3) {
    return pool
      .query(
        "insert into expenses(sales_rep_id,amount_paid,description)values($1,$2,$3) returning *",
        [sales_rep_id, parseFloat(amount_paid), description]
      )
      .then((result) => res.send(result.rows[0]))
      .catch((e) => console.log("error", e));
  }
  if (Object.keys(req.body).length === 4) {
    return pool
      .query(
        "insert into expenses(sales_rep_id,date,amount_paid,description)values($1,$2,$3,$4) returning *",
        [sales_rep_id, date, parseFloat(amount_paid), description]
      )
      .then((result) => res.send(result.rows[0]))
      .catch((e) => console.log("error", e));
  } else {
    res.status(400).send("Bad Request");
  }
};

exports.updateExpenseEntry = async (req, res) => {
  const { id } = req.params;
  const { date, amount_paid, description } = req.body;
  let dbArgs = [];
  amount_paid && dbArgs.push(parseFloat(amount_paid));
  date && dbArgs.push(date);
  description && dbArgs.push(description);

  let query = `update expenses set 
  ${amount_paid ? " amount_paid = $1 " : ""}
  ${date ? " date = $2 " : ""}
  ${description ? " description = $3 " : ""}
  where id=${id}`.trim();

  if (isNaN(id)) {
    return res.status(400).send("Invalid ID");
  }

  const doesIdExists = await pool
    .query("SELECT EXISTS(SELECT 1 FROM sales WHERE id = $1)", [parseInt(id)])
    .then((result) => result.rows[0].exists);

  if (doesIdExists) {
    return pool
      .query(query, dbArgs)
      .then(() => res.status(200).send(`Sales Entry modified with id:${id}`))
      .catch((e) => console.log("Error PUT request =>", e));
  } else {
    return res.status(400).send("ID does not exist");
  }
};

exports.deleteExpenseEntry = async (req, res) => {
  console.log(req.params);
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).send("Invalid ID");
  }

  const doesIdExists = await pool
    .query("SELECT EXISTS(SELECT 1 FROM expenses WHERE id = $1)", [
      parseInt(id),
    ])
    .then((result) => result.rows[0].exists);

  if (doesIdExists) {
    return pool
      .query("delete from expenses where id=$1", [parseInt(id)])
      .then(() => res.status(200).send(`Deleted an entry with id:${id}`))
      .catch((e) => console.log("Error DELETE request =>", e));
  } else {
    return res.status(400).send("ID does not exist");
  }
};
