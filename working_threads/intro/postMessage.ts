import { Worker } from "worker_threads";

const workerCode = `
const { parentPort } = require("worker_threads");

parentPort.once('message', (message) => parentPort.postMessage({ pong: message}))
`;

const worker = new Worker(workerCode, { eval: true });

worker.once("message", message => console.log(message));
worker.postMessage("ping");
