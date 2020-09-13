const fs = require("fs");
const path = require("path");
const mime = require("mime");
const http2 = require("http2");
const http = require("http");

const files = getFiles();

let port = NaN;
http2
  .createSecureServer(
    {
      key: fs.readFileSync(path.join(__dirname, ".secret/key.pem")),
      cert: fs.readFileSync(path.join(__dirname, ".secret/cert.pem")),
    },
    (req, res) => {
      const {
        HTTP2_HEADER_CONTENT_LENGTH,
        HTTP2_HEADER_LAST_MODIFIED,
        HTTP2_HEADER_STATUS,
        HTTP2_HEADER_CONTENT_TYPE,
      } = http2.constants;

      const fileKey = Array.from(files.keys())[
        Math.floor(Math.random() * files.size)
      ];
      const file = files.get(fileKey);

      res.stream.respondWithFD(file.fileDesc, {
        [HTTP2_HEADER_STATUS]: 200,
        [HTTP2_HEADER_CONTENT_LENGTH]: file.contentLength,
        [HTTP2_HEADER_CONTENT_TYPE]: file.contentType,
        [HTTP2_HEADER_LAST_MODIFIED]: file.lastModified,
      });
    },
  )
  .listen((port = 3000), "127.0.0.1", () =>
    console.info(`Listening on port ${port} ...`),
  );

function getFiles(dir = "/home/tajpouria/Pictures") {
  const files = new Map();

  fs.readdirSync(dir).forEach((fileName) => {
    const filepath = path.join(dir, fileName);
    const fileDesc = fs.openSync(filepath, "r");
    const stats = fs.fstatSync(fileDesc);
    const contentType = mime.getType(filepath);

    if (contentType?.match(/(.*.(jpg|jpeg|png)$)/))
      files.set("/" + fileName, {
        filepath,
        fileDesc,
        contentType,
        contentLength: stats.size,
        lastModified: stats.mtime.toUTCString(),
      });
  });

  return files;
}

http
  .createServer((req, res) => {
    res.writeHead(200);
    res.setHeader("Content-Type", "text/html");
    res.end("Hello World!");
  })
  .listen(3001, "127.0.0.1", () => console.info(`Listening on Port ${port}`));
