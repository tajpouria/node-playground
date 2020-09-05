import { Worker, isMainThread, workerData, parentPort } from "worker_threads";

let res = 0;
if (isMainThread) {
  const worker = new Worker(__filename, { workerData: { num: 2 } });

  worker.once("exit", () => {
    console.info(`Square of 2 is ${res}`);
  });
} else {
  if (parentPort) res = workerData.num ** 2;
  console.info(res);
  process.exit();
}
