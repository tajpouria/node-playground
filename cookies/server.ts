import * as express from "express";

const app = express();

const PORT = 8080;

app.get("/", (_req, res) => {
  res.setHeader("set-cookie", ["from=server", "another_one=from_server"]);

  res.sendFile(`${__dirname}/index.html`);
});

app.get("/path-1", (req, res) => {
  res.setHeader("set-cookie", ["path=1 ;path=/path-1"]);
  res.send(req.headers.cookie);
});

app.get("/path-2", (req, res) => {
  res.setHeader("set-cookie", ["path=2 ;path=/path-2"]);
  res.send(req.headers.cookie);
});

app.listen(PORT, () => console.info(`Listening on port ${PORT}`));
