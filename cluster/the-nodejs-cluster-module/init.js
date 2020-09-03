const cluster = require("cluster");
const os = require("os");

if (cluster.isMaster) masterFunc();
if (cluster.isWorker) workerFunc();

function masterFunc() {
  console.info(
    `Mater process ${process.pid} running at ${new Date().getTime()}`
  );

  const workers = [];
  const corsNum = os.cpus().length;
  for (let i = 0; i < corsNum; i++) workers.push(cluster.fork());

  workers.forEach(w => {
    w.on("message", obj =>
      console.info(`Master process received message '${obj.msg}'`)
    );

    w.send({ msg: "Message from master process" });
  });
}

function workerFunc() {
  console.info(
    `Worker process ${process.pid} running at ${new Date().getTime()}`
  );

  process.on("message", obj =>
    console.info(`Worker process ${process.pid} received message '${obj.msg}'`)
  );

  process.send({ msg: `Message from worker process ${process.pid}` });
}
