import { Transform } from "stream";

const toLowerCaseTr = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toLowerCase());
    callback();
  },
});

process.stdin.pipe(toLowerCaseTr).pipe(process.stdout);
