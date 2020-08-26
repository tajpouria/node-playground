const { createServer } = require("http");
const { fork } = require("child_process");

const server = createServer();

server.on("request", async (req, res) => {
  if (req.url === "/compute") {
    const forked = fork("./compute-fork-child.js");
    forked.send("msg");
    forked.on("message", message => {
      res.end(`Sum is ${message}`);
    });
  } else {
    res.end("Ok");
  }
});

server.listen(8080, "127.0.0.1", NaN, () =>
  console.info("Listening on port 8080")
);
