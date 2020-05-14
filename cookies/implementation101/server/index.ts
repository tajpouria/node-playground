import * as express from "express";
import * as dotenv from "dotenv";
import * as session from "express-session";
import * as connectStore from "connect-mongo";
import * as mongoose from "mongoose";

dotenv.config();

import { connectToDB } from "./db";
import { usersController } from "./controllers";

(async () => {
  try {
    await connectToDB();

    const MongoStore = connectStore(session);

    const app = express();
    app.disable("x-powered-by");
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(
      session({
        name: process.env.SESS_NAME,
        secret: process.env.SESS_SECRET,
        saveUninitialized: false,
        resave: false,
        store: new MongoStore({
          mongooseConnection: mongoose.connection,
          collection: "session",
          ttl: +process.env.SESS_LIFETIME
        }),
        cookie: {
          sameSite: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: +process.env.SESS_LIFETIME
        }
      })
    );

    const apiController = express.Router();

    app.use("/api", apiController);
    apiController.use("/users", usersController);

    const port = process.env.PORT;
    app.listen(port, () => {
      console.info(`Listening on port ${port}`);
    });
  } catch (err) {
    throw new Error(err);
  }
})();
