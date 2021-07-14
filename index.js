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
const { verifyToken } = require("./utils/tokens");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",

    // methods: ["GET", "POST",PT],
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

app
  .route("/income")
  .get(verifyToken, getAllIncome)
  .post(verifyToken, addIncomeEntry);
app
  .route("/income/:id")
  .put(verifyToken, updateIncomeEntry)
  .delete(verifyToken, deleteIncomeEntry);

app
  .route("/expense")
  .get(verifyToken, getAllExpenses)
  .post(verifyToken, addExpenseEntry);
app
  .route("/expenses/:id")
  .put(verifyToken, updateExpenseEntry)
  .delete(verifyToken, deleteExpenseEntry);

app.get("/filter", verifyToken, filterSales);

app.listen(port, () => {
  console.log(`server running on http://${hostname}:${port}`);
});
