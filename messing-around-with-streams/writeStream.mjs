import * as fs from "fs";

async function copy(readable, writeable) {
  for await (const chunk of readable) {
    writeable.write(chunk);
  }
}

(async () => {
  const readStream = fs.createReadStream("./geekfile.txt", {
    encoding: "utf-8"
  });

  const writeStream = fs.createWriteStream("./geekfile.copy.txt");

  await copy(readStream, writeStream);

  console.log("Copied!");
})();

// e.g.2

const exampleWriteable = fs.createWriteStream("writeExample.txt", {
  encoding: "utf-8"
});

exampleWriteable.write("Hello");
exampleWriteable.end("World");
