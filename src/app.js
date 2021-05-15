import express from "express";

const app = express();
const hostname = "127.0.0.1";
const port = 3000;

const requestTime = (req, res, next) => {
  req.requestStartAt = new Date().getMilliseconds();
  next();
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
  res.statusCode = 200;
  res.statusMessage = "OK express";
  const endTime = new Date().getMilliseconds();
  console.log(endTime, req.requestStartAt);
  res.send(`
    <p>Request-Response time taken: ${
      parseInt(endTime) - parseInt(req.requestStartAt)
    } milliseconds.<p>
  `);
});

app.listen(port, () => {
  console.log(`Example app listening at http://${hostname}:${port}`);
});
