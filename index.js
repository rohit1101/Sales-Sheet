const {
  getAllSales,
  addSalesEntry,
  updateSalesEntry,
  deleteSalesEntry,
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

app.get("/sales", getAllSales);
app.post("/sale", addSalesEntry);
app.put("/sales/:id", updateSalesEntry);
app.delete("/sales/:id", deleteSalesEntry);
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
