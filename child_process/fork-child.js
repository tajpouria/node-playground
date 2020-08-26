//The biggest difference between spawn and fork is that a communication channel is 
//established to the child process when using fork, so we can use the send function 
//on the forked process along with the global process object itself to 
//exchange messages between the parent and forked processes

const { fork } = require("child_process");

process.on("message", message => {
  console.info(
    `ChildOnMessage: typeof:${typeof message}, ${JSON.stringify(message)}`
  );
});

let conunter = 0;

setInterval(() => {
  process.send({ conunter: ++conunter }); // Send message to forked.on('message')
}, 1000);
