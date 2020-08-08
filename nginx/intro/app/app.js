const http = require("http");
const { networkInterfaces } = require("os");

const { PORT = 3000 } = process.env;
const ni = getNetworkInterface();

http
  .createServer((req, res) => {
    if (req.url === "/") {
      res.writeHead(200, { "content-type": "text/html" });
      res.write(`<html><body><h1>Hello World!</h1>
      <pre>${JSON.stringify(ni, null, 2)}</pre></body></html>`);
      res.end();
    }

    if (/^\/.+/.test(req.url)) {
      res.writeHead(200, { "content-type": "text/html" });
      res.write(
        `<html><body><h1>${req.url.substr(1, Infinity)}</h1>
        <pre>${JSON.stringify(ni, null, 2)}</pre>
        </body></html>`
      );
      res.end();
    }
  })
  .listen(PORT, NaN, () => console.info(`Listening on ${PORT}...`));

process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));

function getNetworkInterface() {
  const nets = networkInterfaces();
  const results = Object.create(null);

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }

        results[name].push(net.address);
      }
    }
  }

  return results;
}
