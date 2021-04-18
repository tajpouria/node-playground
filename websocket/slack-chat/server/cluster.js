const cluster = require("cluster");
const { setupMaster } = require("@socket.io/sticky");
const http = require("http");

const WORKER_COUNT = require("os").cpus().length;

if (cluster.isMaster) {
  console.info(`Master ${process.pid} started`);

  for (let index = 0; index < WORKER_COUNT; index++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.info(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });

  const httpServer = http.createServer();
  setupMaster(httpServer, {
    loadBalancingMethod: "least-connection",
  });
  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () =>
    console.log(`server listening at http://localhost:${PORT}`),
  );
} else {
  console.info(`Worker ${process.pid} started`);
  require("./index");
}
