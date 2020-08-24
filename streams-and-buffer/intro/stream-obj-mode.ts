// By default streams expect either **Buffer or String**. But two flag `readableObjectMode`: Allow to **push** Object, and, `writableObjectMode`: Allow to **receive** Object allow
// Streams to work with any kind of javaScript Object

import { Transform } from "stream";

const CommaStringToArrayTr = new Transform({
  readableObjectMode: true, // Allow to push Object
  transform(chunk, encoding, cb) {
    this.push(chunk.toString().trim().split(","));
    cb();
  },
});

const arrayToObjTr = new Transform({
  writableObjectMode: true, // Allow to receive Object
  readableObjectMode: true, // Allow to push Object

  transform(chunk, encoding, cb) {
    const obj = {};

    for (let i = 0; i < chunk.length; i += 2) {
      if (i + 1 >= chunk.length) break;
      obj[chunk[i]] = chunk[i + 1];
    }
    this.push(obj);

    cb();
  },
});

const objToStringTr = new Transform({
  writableObjectMode: true, // Allow to receive Object
  transform(chunk, enconding, cb) {
    this.push(JSON.stringify(chunk) + "\n");
    cb();
  },
});

process.stdin
  .pipe(CommaStringToArrayTr)
  .pipe(arrayToObjTr)
  .pipe(objToStringTr)
  .pipe(process.stdout);
