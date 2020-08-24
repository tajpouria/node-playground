import { Duplex } from "stream";

let charCode = 65;

const inOutStream = new Duplex({
  read() {
    this.push(String.fromCharCode(charCode));
    charCode++;
    if (charCode > 90) this.push(null);
  },

  write(chunk, encoding, callback) {
    console.info(chunk.toString());
    callback();
  },
});

inOutStream.pipe(inOutStream);
