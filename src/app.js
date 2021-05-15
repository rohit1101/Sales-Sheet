import express from "express";

const app = express();
const hostname = "127.0.0.1";
const port = 3000;

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
  console.log(`Example app listening at http://127.0.0.1:${port}`);
});
