const http = require("http");
const url = require("url");
const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  const queryParam = url.parse(req.url, true).query;
  console.log(queryParam, req.headers.host);
  console.log(req.url, req.method, req.body);
  // Req-res
  if (req.method === "POST") {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      console.log(JSON.parse(data));
      res.end("data is saved");
    });
  }
  // res.statusCode = 200;
  // HTML response from backend
  // const htmlFromServer = `<h1> We are the kings of the world ....ing kings of the world</h1>`;
  // res.setHeader("Content-Type", "text/html");
  // res.end(htmlFromServer);

  // Plain text
  // res.setHeader("Content-Type", "text/plain");
  // res.end("Response from backend task to rest-client");

  // JSON res
  // const jsonRes = {
  //   data: "Response from backend task to rest-client",
  // };
  // res.setHeader("Content-Type", "application/json");
  // res.end(JSON.stringify(jsonRes));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});

// Idk what is pathname req.pathname is undefined
