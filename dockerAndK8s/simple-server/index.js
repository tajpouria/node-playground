const express = require("express");
const { Logger } = require("@tajpouria/mss-utils");

const logger  = new Logger(process.cwd())

const app = express();

app.get("/", (_, res) => res.send("<h1>Hello World</h1>"));

app.listen(8080, () => logger.info("Listening on 8080"));
