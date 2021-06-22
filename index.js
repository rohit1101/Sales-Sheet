const {
  getAllIncome,
  addIncomeEntry,
  updateIncomeEntry,
  deleteIncomeEntry,
  filterSales,
  getAllExpense,
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

app.get("/sales", getAllIncome);
app.get("/filter", filterSales);
app.post("/sale", addIncomeEntry);
app.put("/sales/:id", updateIncomeEntry);
app.delete("/sales/:id", deleteIncomeEntry);
app.get("/expenses", getAllExpense);
app.post("/expense", addExpenseEntry);
app.put("/expenses/:id", updateExpenseEntry);
app.delete("/expenses/:id", deleteExpenseEntry);

app.listen(3000, () => {
  console.log(`server running on http://${hostname}:${port}`);
});
