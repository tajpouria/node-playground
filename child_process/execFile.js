const { execFile } = require("child_process");

const child = execFile("./executable.sh");

child.stdout.pipe(process.stdout);
