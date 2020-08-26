// exec Buffer the whole stdout and stderr then pass it to callback function
// Also it user shell to execute the command
// The spawn function is a much better choice when the size of the data expected from
// the command is large, because that data will be streamed with the standard IO objects.
// It it doesn't use shell to run command
//
// spawn not use shell to execute the command so we cannot combine shell syntax in the
// way we handle it using exec

const { exec, spawn } = require("child_process");

exec("find . -type f | wc ", (err, stdout) => {
  if (err) {
    console.info(`Exec error:\n ${err}`);
    return;
  }

  console.info(`Exec output:\n ${stdout}`);
});

// However
// We can make the spawned child process inherit the standard IO objects of its parents
// if we want to, but also, more importantly, we can make the spawn function use the shell syntax
// as well. Here’s the same find | wc command implemented with the spawn function:
const child = spawn("echo $child: && find . -type f | wc", {
  // Because of the stdio: 'inherit' option above, when we execute the code,
  // the child process inherits the main process stdin, stdout, and stderr.
  // This causes the child process data events handlers to be triggered on
  // the main process.stdout stream, making the script output the result right away.
  stdio: "inherit",
  // Because of the shell: true option above, we were able to use the shell syntax in the
  // passed command, just like we did with exec. But with this code,
  // we still get the advantage of the streaming of data that the spawn function gives us.
  // This is really the best of both worlds.
  shell: true,
  // Change the working directory of the script.
  cwd: "/home/tajpouria/Downloads",
  // Set environment variables
  env: { child: "spawn child" }
});
