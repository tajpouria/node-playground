import { Readable } from "stream";

let currentCharCode = 65;

const inStream = new Readable({
  read() {
    this.push(String.fromCharCode(currentCharCode));
    currentCharCode++;

    if (currentCharCode > 180) this.push(null);
  },
});

inStream.pipe(process.stdout);
