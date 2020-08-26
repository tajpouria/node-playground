// The example below will run a node script (timer.js) in the background by
// detaching and also ignoring its parent stdio file descriptors
// so that the parent can terminate while the child keeps running in the background.
// Check background running process ps -ef | grep timer.js

const { spawn } = require("child_process");

const child = spawn("node", ["./timer.js"], {
  stdio: "ignore",
  detached: true
});

child.unref(); // The parent process can exit independently of the child.
