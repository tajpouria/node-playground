const http = require("http");
const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("./abels-key.pem"),
  cert: fs.readFileSync("./abels-cert.pem")
};

const app = (_, res) => {
  res.writeHead(200);
  res.end("Hello World!\n");
};

http
  .createServer(app)
  .listen(8080, null, () => console.info("HTTP listening on 8080"));

https
  .createServer(options, app)
  .listen(4333, null, () => console.info("HTTPS listening on 4333"));
