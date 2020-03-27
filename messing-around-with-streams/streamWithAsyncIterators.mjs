import * as fs from "fs";

async function logFile(readable) {
  for await (const chunk of readable) {
    console.log(chunk);
  }
}

const readStream = fs.createReadStream("./geekfile.txt", "UTF-8");

logFile(readStream);
