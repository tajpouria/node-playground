const { createServer } = require("http");
const { createReadStream, stat } = require("fs");
const { promisify } = require("util");
const { pipeline, errorMonitor } = require("stream");
const { start } = require("repl");

const _10MbFilePath = "/home/tajpouria/Desktop/10Mb.txt";
const statAsync = promisify(stat);
let port = null;

createServer(async (req, res) => {
  // Creating a readStream from entire the file
  let readStream = createReadStream(_10MbFilePath);

  try {
    // Getting file size
    const { size } = await statAsync(_10MbFilePath);

    // Reading HTTP Range header
    const range = req.headers.range;

    if (range) {
      // Calculating start and end
      let [start, end] = range.replace(/bytes=/, "").split("-");
      start = parseInt(start, 10);
      end = parseInt(end, 10);

      if (typeof start === "number" && isNaN(end)) {
        end = size - 1;
      }
      if (isNaN(start) && typeof end === "number") {
        start = size - end;
        end = size - 1;
      }

      // Check if range is satisfiable
      if (start >= size || end >= size) {
        res.writeHead(416, {
          "Content-range": `bytes */${size}`,
        });
        return res.end("Range Not Satisfiable");
      }

      // Writing associated response headers
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${size}`,
        "Accept-Range": "bytes",
        "Content-Length": end - start + 1,
        "Content-Type": "text/plain",
      });

      // Changing readStream to specified range
      readStream = createReadStream(_10MbFilePath, { start, end });
    }

    // Piping readStream to response writeStream
    pipeline(readStream, res, (err) => {
      if (err) {
        throw new Error(err);
      }
    });
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end("Internal Server Error");
  }
}).listen((port = +process.argv[2] || 3000), "127.0.0.1", NaN, () =>
  console.info(`Listening on port ${port}...`),
);
