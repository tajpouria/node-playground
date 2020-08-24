import { createReadStream, createWriteStream } from "fs";
import { createGzip } from "zlib";
import { Transform } from "stream";

const file = process.argv[2];

const reportTr = new Transform({
  transform(chunk, enconding, cb) {
    process.stdout.write(".");
    cb(null, chunk); // Second argument is another way for this.push(chunk);
  },
});

createReadStream(file)
  .pipe(createGzip())
  .pipe(reportTr)
  .pipe(createWriteStream(`${file}.gz`))
  .on("finish", () => console.info(`${file}.gz Created`));
