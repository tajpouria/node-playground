import * as stream from "stream";
import * as fs from "fs";
import * as zlib from "zlib";

stream.pipeline(
  fs.createReadStream("./example.txt"),
  zlib.createGzip(),
  fs.createWriteStream("./example.txt.gz"),
  err => {
    if (err) {
      console.error(err);
    } else {
      console.info("Pipe line succeeded");
    }
  }
);
