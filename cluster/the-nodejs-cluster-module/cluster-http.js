const { isMaster, isWorker, fork } = require("cluster");
const { cpus } = require("os");
const { createServer } = require("http");

if (isMaster) masterFunc();
else if (isWorker) workerFunc();

function masterFunc() {
  console.info(`Master process ${process.pid} running`);

  const corsNum = cpus().length ?? 1;
  for (let i = 0; i < corsNum; i++) fork();
}

function workerFunc() {
  const port = 3000;
  createServer((_req, res) => {
    console.info(`Worker process ${process.pid} is Handling the request`);
    res.writeHead(200);
    res.end("Hello World");

  }).listen(port, "127.0.0.1", NaN, () =>
    // The master process is the one who listens in the given port and load balances the requests among all the child/worker processes
    console.info(`Woker process ${process.pid} Listening on ${port}`) 
  );
}
