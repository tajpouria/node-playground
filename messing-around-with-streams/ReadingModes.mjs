import * as fs from "fs";

// Flow mode

const readableStream = fs.createReadStream("./geekfile.txt", {
  encoding: "utf-8"
}); // Create a readable stream in Stop modes

let flowData = "";

readableStream.on("data", chunk => {
  flowData += chunk;
}); // As soon as starting to listening to data event the data start flowing

readableStream.on("error", err => {
  console.info(err);
});

readableStream.on("end", () => {
  console.info(flowData);
});

console.log("Program ends");

// Pause mode

const readableStream1 = fs.createReadStream("./geekfile.txt", {
  encoding: "utf-8"
});

let pauseData = "";
let chunk;

readableStream1.on("readable", () => {
  while ((chunk = readableStream1.read()) != null) {
    // The read method keep returning data from the internal buffer until there is nothing to read then it returns null
    pauseData += chunk;
  }
});

readableStream1.on("end", () => {
  console.info(pauseData);
});

