require("dotenv").config();
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

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    });
  })
);

const requestTime = (req, res, next) => {
  let start = new Date().getTime();
  next();
  let end = new Date().getTime();
  console.log(`${req.method} ${req.path} ${end - start} ms.`);
};

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

app.use(requestTime);

app.route("/register").post(registerNewUser);
app.route("/login").get(loginUser);

app.route("/income").get(getAllIncome).post(addIncomeEntry);
app.route("/income/:id").put(updateIncomeEntry).delete(deleteIncomeEntry);

app.route("/expense").get(getAllExpenses).post(addExpenseEntry);
app.route("/expenses/:id").put(updateExpenseEntry).delete(deleteExpenseEntry);

app.get("/filter", filterSales);

app.listen(port, () => {
  console.log(`server running on http://${hostname}:${port}`);
});
