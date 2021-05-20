import express from "express";

const app = express();
const hostname = "127.0.0.1";
const port = 3000;

const requestTime = (req, res, next) => {
  let start = new Date().getTime();
  next();
  let end = new Date().getTime();
  console.log(`${req.method} ${req.path} ${end - start} ms.`);
};

app.use(requestTime);

app.get("/", (req, res) => {
  console.log(
    req.url,
    req.headers,
    req.route,
    req.params,
    req.path,
    req.method
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://${hostname}:${port}`);
});
