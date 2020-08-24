import { Writable } from "stream";

const stdout = new Writable({
  write(chunk, enconding, callback) {
    console.info(chunk.toString());
    callback();
  },
});

process.stdin.pipe(stdout);
