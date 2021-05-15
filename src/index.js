const http = require("http");
const url = require("url");
const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  // Create an endpoint to read headers from request
  const queryParam = url.parse(req.url, true).query;
  console.log(queryParam, req.headers.host);
  console.log(req.url, req.method);

  // Create an endpoint to return a text response
  if (req.url === "/plaintext") {
    res.statusCode = 200;
    res.statusMessage = "Plain text data sent";
    res.setHeader("Content-Type", "text/plain");
    res.end(JSON.stringify("Response from backend task to rest-client"));
  }

  // Create an endpoint to return a json response
  if (req.url === "/jsonresponse") {
    const jsonRes = {
      data: "Response from backend task to rest-client",
    };
    res.statusCode = 200;
    res.statusMessage = "Json response sent";
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(jsonRes));
  }

  // Create an endpoint to return a html response
  if (req.url === "/htmlres") {
    res.statusCode = 200;
    res.statusMessage = "HTML response sent";
    const data = `<h1> We are the kings of the world ....ing kings of the world</h1>`;
    res.setHeader("Content-Type", "text/html");
    res.end(data);
  }

  // Handling POST request
  if (req.method === "POST") {
    if (req.url === "/postdata") {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk;
      });
      req.on("end", () => {
        console.log(JSON.parse(data));
        res.statusCode = 200;
        res.statusMessage = "POST operation successful";
        res.end(JSON.stringify("data is saved"));
      });
    }
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
