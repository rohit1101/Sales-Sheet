import express from "express";

const app = express();
const hostname = "127.0.0.1";
const port = 3000;

// const myLogger = (req, res, next) => {
//   console.log(`Logging ${req.method} request with this URL: ${req.url} `);
//   next();
// };
const requestTime = (req, res, next) => {
  req.requestStartAt = new Date().toLocaleTimeString();
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
  res.send(`
  <p>Requested initiated at ${req.requestStartAt}<p>
  <p>Requested ended at ${new Date().toLocaleTimeString()}<p>`);
  //   <p>Request-Response time taken: ${
  //     new Date().getSeconds() - req.timeInSeconds
  //   } seconds.<p>
});

app.listen(port, () => {
  console.log(`Example app listening at http://${hostname}:${port}`);
});
