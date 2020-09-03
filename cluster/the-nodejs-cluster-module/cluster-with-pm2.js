const { createServer } = require("http");

console.info(`Master process ${process.pid} runnig`);

createServer((_req, res) => {
  res.writeHead(200);
  res.end("Hello World");
  process.exit(0);
}).listen(3000, "127.0.0.1", NaN, () =>
  console.info(`Listening on port ${3000}`)
);
