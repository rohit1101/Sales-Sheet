const {
  getAllIncome,
  addIncomeEntry,
  updateIncomeEntry,
  deleteIncomeEntry,
  filterSales,
  getAllExpenses,
  addExpenseEntry,
  updateExpenseEntry,
  deleteExpenseEntry,
} = require("./queries");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    // methods: ["GET", "POST"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const hostname = "127.0.0.1";
const port = 3000;

const requestTime = (req, res, next) => {
  let start = new Date().getTime();
  next();
  let end = new Date().getTime();
  console.log(`${req.method} ${req.path} ${end - start} ms.`);
};

app.use(requestTime);

app.get("/income", getAllIncome);
app.post("/income", addIncomeEntry);
app.put("/income/:id", updateIncomeEntry);
app.delete("/income/:id", deleteIncomeEntry);

app.get("/expenses", getAllExpenses);
app.post("/expense", addExpenseEntry);
app.put("/expenses/:id", updateExpenseEntry);
app.delete("/expenses/:id", deleteExpenseEntry);

app.get("/filter", filterSales);

app.listen(3000, () => {
  console.log(`server running on http://${hostname}:${port}`);
});
