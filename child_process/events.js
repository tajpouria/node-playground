const { spawn } = require("child_process");

const child = spawn("pwd");

child.on("exit", (code, signal) =>
  console.info(`Child process exited with code ${code} and signal ${signal}`)
);

child.on("disconnect", () => console.info("Child process.disconnect() called"));

child.on("error", err =>
  console.error(`Child process could not be spawned or killed: ${err}`)
);

child.on("message", message =>
  console.info(`Child process.send() have called with: ${message}`)
);

child.on("close", () => console.info("Child stdio have been closed"));
