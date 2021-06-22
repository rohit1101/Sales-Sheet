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

exports.getAllIncome = (req, res) => {
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

exports.addIncomeEntry = (req, res) => {
  const { card_id, sales_rep_id, date, amount_paid } = req.body;
  let dbArgs = Object.keys(req.body);

  let dbVals = [];
  let query = "";

  card_id && dbVals.push(+card_id);
  sales_rep_id && dbVals.push(+sales_rep_id);
  date && dbVals.push(date);
  amount_paid && dbVals.push(+amount_paid);

  const updateStr = [...dbArgs].map((item, index) => item).join(",");
  query = `insert into sales(${updateStr}) values($1,$2,$3,$4) returning *;`;

  console.log(query, dbArgs, dbVals);

  if (query) {
    return pool
      .query(query, dbVals)
      .then((result) => res.send(result.rows[0]))
      .catch((e) => console.log("error", e));
  } else {
    res.status(400).send("Bad Request");
  }
};

exports.updateIncomeEntry = async (req, res) => {
  const { id } = req.params;
  const { date, amount_paid, card_id } = req.body;
  let dbArgs = Object.keys(req.body);
  console.log(dbArgs);
  let dbVals = [];
  let query = "";

  amount_paid && dbVals.push(+amount_paid);
  date && dbVals.push(date);
  card_id && dbVals.push(+card_id);

  if (dbArgs.length === 1) {
    query = `update sales set ${dbArgs[0]}=$1  where id=${id};`;
  } else {
    const updateStr = [...dbArgs]
      .map((item, index) => item + `=$${index + 1}`)
      .join(",");
    console.log(updateStr);
    query = `update sales set ${updateStr} where id=${id};`;
  }

  console.log(query, dbArgs, dbVals);

  if (isNaN(id)) {
    return res.status(400).send("Invalid ID");
  }

  const doesIdExists = await pool
    .query("SELECT EXISTS(SELECT 1 FROM sales WHERE id = $1)", [parseInt(id)])
    .then((result) => result.rows[0].exists);

  if (doesIdExists) {
    return pool
      .query(query, dbVals)
      .then(() => res.status(200).send(`Sales Entry modified with id:${id}`))
      .catch((e) => console.log("Error PUT request =>", e));
  } else {
    return res.status(400).send("ID does not exist");
  }
};

exports.deleteIncomeEntry = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).send("Invalid ID");
  }

  const doesIdExists = await pool
    .query("SELECT EXISTS(SELECT 1 FROM sales WHERE id = $1)", [parseInt(id)])
    .then((result) => result.rows[0].exists);

  doesIdExists
    ? pool
        .query("delete from sales where id=$1", [parseInt(id)])
        .then(() => res.status(200).send(`Deleted an entry with id:${id}`))
        .catch((e) => console.log("Error DELETE request =>", e))
    : res.status(400).send("ID does not exist");
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
  let dbArgs = Object.keys(req.body);
  console.log(dbArgs);
  let dbVals = [];
  let query = "";

  amount_paid && dbVals.push(+amount_paid);
  date && dbVals.push(date);
  description && dbVals.push(description);

  if (dbArgs.length === 1) {
    query = `update expenses set ${dbArgs[0]}=$1  where id=${id};`;
  } else {
    const updateStr = [...dbArgs]
      .map((item, index) => item + `=$${index + 1}`)
      .join(",");
    console.log(updateStr);
    query = `update expenses set ${updateStr} where id=${id};`;
  }

  console.log(query, dbArgs, dbVals);

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
      .query(query, dbVals)
      .then(() => res.status(200).send(`Expenses Entry modified with id:${id}`))
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
