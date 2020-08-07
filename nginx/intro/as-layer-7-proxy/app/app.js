const http = require("http");
const { profileEnd } = require("console");

const { PORT } = process.env;
http
  .createServer((req, res) => {
    if (req.url === "/") {
      res.writeHead(200, { "content-type": "text/html" });
      res.write(`<html><body><h1>Hello World!:${PORT}</h1></body></html>`);
      res.end();
    }

    if (/^\/.+/.test(req.url)) {
      res.writeHead(200, { "content-type": "text/html" });
      res.write(
        `<html><body><h1>${req.url.substr(
          1,
          Infinity,
        )}:${PORT}</h1></body></html>`,
      );
      res.end();
    }
  })
  .listen(process.env.PORT, NaN, () =>
    console.info(`Listening on ${process.env.PORT}...`),
  );

process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));
