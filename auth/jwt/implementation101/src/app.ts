import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import cookieParser from "cookie-parser";

import { sessionRouter } from "./router/sessionRouter";
import { jwtRouter } from "./router/jwtRouter";

config();

(async () => {
  const app = express();

  app.use((_, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  });
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.static(`${process.cwd()}/src/static`));

  const {
    DB_URL = "mongodb://localhost:27017/jwtImplementation101",
    PORT = 8000,
  } = process.env;

  try {
    await mongoose.connect(
      DB_URL,
      { useNewUrlParser: true, useUnifiedTopology: true },
      () => {
        console.info(`Connected to ${DB_URL}`);
      },
    );

    app.use("/session", sessionRouter);
    app.use("/jwt", jwtRouter);

    await app.listen(PORT, () => {
      console.info(`Listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
