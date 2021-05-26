const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const hostname = "127.0.0.1";
const port = 3000;
const { getAllSales, addSalesEntry } = require("./queries");

const requestTime = (req, res, next) => {
  let start = new Date().getTime();
  next();
  let end = new Date().getTime();
  console.log(`${req.method} ${req.path} ${end - start} ms.`);
};

app.use(requestTime);

app.get("/sales", getAllSales);
app.post("/sale", addSalesEntry);
// app.get("/users/:userId/sales/:salesId", addNewSalesEntry);

app.listen(port, () => {
  console.log(`Example app listening at http://${hostname}:${port}`);
});

// console.log(
//   req.url,
//   req.headers,
//   req.route,
//   req.params,
//   req.path,
//   req.method
// );
