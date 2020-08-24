import { createGzip } from "zlib";
import { createReadStream, createWriteStream } from "fs";

const file = process.argv[2] as string;

createReadStream(file)
  .pipe(createGzip())
  .pipe(createWriteStream(`${file}.gz`));
