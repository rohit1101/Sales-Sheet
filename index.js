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
  registerNewUser,
  loginUser,
} = require("./queries");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    // methods: ["GET", "POST"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const hostname = "127.0.0.1";
const port = 5000;

const requestTime = (req, res, next) => {
  let start = new Date().getTime();
  next();
  let end = new Date().getTime();
  console.log(`${req.method} ${req.path} ${end - start} ms.`);
};

app.use(requestTime);

app.route("/register").post(registerNewUser);
app.route("/login").post(loginUser);

app.route("/income").get(getAllIncome).post(addIncomeEntry);
app.route("/income/:id").put(updateIncomeEntry).delete(deleteIncomeEntry);

app.route("/expense").get(getAllExpenses).post(addExpenseEntry);
app.route("/expenses/:id").put(updateExpenseEntry).delete(deleteExpenseEntry);

app.get("/filter", filterSales);

app.listen(port, () => {
  console.log(`server running on http://${hostname}:${port}`);
});
