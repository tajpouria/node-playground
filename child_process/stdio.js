/*
child.stdin
child.stdout
child.stderr
*/

const { spawn } = require("child_process");

// Pipe child stdio stream to process.stdio
const child = spawn("pwd");
child.stdout.pipe(process.stdout); // Child process stdout and stderr are readable from
child.stderr.pipe(process.stderr); // in main process

const anotherChild = spawn("find", [".", "type", "f"]);
anotherChild.stdout.on("data", data => process.stdout.write(data.toString()));

// Pipe child stdio to each other
const find = spawn("find", [".", "-type", "f"]);
const wc = spawn("wc");
find.stdout.pipe(wc.stdin);
wc.stdout.pipe(process.stdout);

// Pipe process.stdio to child.stdio
const yetAnotherChild = spawn("wc");
process.stdin.pipe(yetAnotherChild.stdin); // After entering input hit Ctrl+d to end input
yetAnotherChild.stdout.pipe(process.stdout);
