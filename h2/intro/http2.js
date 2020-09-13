const fs = require("fs");
const path = require("path");
const mime = require("mime");
const http2 = require("http2");

const files = getFiles();

let port = NaN;
http2.createSecureServer(
  {
    key: fs.readFileSync(path.join(__dirname, ".secret/key.pem")),
    cert: fs.readFileSync(path.join(__dirname, ".secret/cert.pem")),
  },
  (req, res) => {
    const file = files.get(
      Array.from(files.keys())[Math.floor(Math.random() * files.size)],
    );

    res.stream.pushStream(
      { [http2.constants.HTTP2_HEADER_PATH]: file.filepath },
      (err, pushStream) => {
        if (err) {
          console.error(err);
          res.writeHead(500);
          res.end("Internal Server Error");
        }
        pushStream.respondWithFD(file.fileDesc, file.headers);
      },
    );
    res.stream.respond({ ":status": 200 });
  },
);

const server = http2.createSecureServer({
  key: fs.readFileSync(path.join(__dirname, ".secret/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, ".secret/cert.pem")),
});
server
  .on("stream", (stream, headers, flags) => {
    const {
      HTTP2_HEADER_METHOD,
      HTTP2_HEADER_PATH,
      HTTP2_HEADER_STATUS,
      HTTP2_HEADER_CONTENT_TYPE,
    } = http2.constants;

    const method = headers[HTTP2_HEADER_METHOD];
    const path = headers[HTTP2_HEADER_PATH];

    stream.respond({
      [HTTP2_HEADER_STATUS]: 200,
      [HTTP2_HEADER_CONTENT_TYPE]: "text/plain; charset=utf-8",
    });
    stream.write("hello ");
    stream.end("world");
  })
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

    if (contentType?.match(/(.*.(jpg|jpeg|png|webp|svg)$)/))
      files.set("/" + fileName, {
        filepath,
        fileDesc,
        headers: {
          "Content-Length": stats.size,
          "Last-Modified": stats.mtime.toUTCString(),
          "Content-Type": contentType,
        },
      });
  });

  return files;
}
