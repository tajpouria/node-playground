const { createServer } = require("http");

createServer((req, res) => {
  console.info(process.pid);
  if (req.url === "/cal") {
    let response = 0;
    for (let i = 0; i < 1e10; i++) response += i;
    res.writeHead(200);
    res.end(response.toString());
    return;
  }

  res.writeHead(200);
  res.end("Free");
}).listen(3000, "127.0.0.1", () => console.info("Listening on port 3000"));
