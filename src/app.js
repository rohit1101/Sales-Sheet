import express from "express";

const app = express();
const hostname = "127.0.0.1";
const port = 3000;

const myLogger = (req, res, next) => {
  console.log(`Logging ${req}`);
  next();
};

app.use(myLogger);

app.get("/", (req, res) => {
  console.log(
    req.url,
    req.headers,
    req.route,
    req.params,
    req.path,
    req.method
  );
  res.statusCode = 200;
  res.statusMessage = "OK express";
  res.send("Hello from express");
});

app.listen(port, () => {
  console.log(`Example app listening at http://${hostname}:${port}`);
});
