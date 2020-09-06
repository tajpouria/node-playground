const { fork } = require("child_process");
const { createServer } = require("http");

createServer(async (req, res) => {
  if (req.url === "/sleep") {
    await sleep(10000);
    res.writeHead(200);
    res.end("Awake\n");
  } else if (req.url === "/heavy") {
    const worker = fork("./fork");
    worker.on("message", msg => {
      res.writeHead(200);
      res.end(`Lifted ${msg}\n`);
    });
    worker.on("error", err => {
      console.error(err);

      res.writeHead(500);
      res.end();
    });
  } else {
    res.writeHead(200);
    res.end("Hello\n");
  }
}).listen(3000);

function sleep(ms) {
  return new Promise(res => {
    setTimeout(res, ms);
  });
}
