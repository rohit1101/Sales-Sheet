const http = require("http");

const hostname = "127.0.0.1";
const port = 3000;

let todos = [];

const server = http.createServer((req, res) => {
  console.log(req.headers, req.method, req.pathname);
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  if (req.url === "/todo/add") {
    res.end(
      JSON.stringify({
        message: "todos",
      })
    );
  } else {
    res.end(
      JSON.stringify({
        message: "dummy",
      })
    );
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
