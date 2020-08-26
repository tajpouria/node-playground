const { fork } = require("child_process");

// we fork child.js (which will execute the file with the node command)
const forked = fork("./fork-child.js");

forked.on("message", message => {
  console.info(
    `ParentOnMessage: typeof:${typeof message}, ${JSON.stringify(message)}`
  );
});

forked.send({ Parent: "Hello" }); // Send message to process.on('message') on *Forked* process
