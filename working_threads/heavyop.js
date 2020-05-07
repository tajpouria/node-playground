const { Worker, isMainThread, parentPort } = require("worker_threads");

if (isMainThread) {
  Array.from({ length: 4 }).forEach(() => {
    const worker = new Worker(__filename);

    worker.on("message", msg => console.info(msg));
  });
} else {
  const start = process.hrtime();
  heavyOpe();

  const elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli;
  parentPort.postMessage(
    `${process.hrtime(start)[0]}s, ${elapsed.toFixed(3)}ms`
  );
}

function heavyOpe(length = 2000000) {
  for (let i in Array.from({ length }).fill(0)) i += 1;
}
