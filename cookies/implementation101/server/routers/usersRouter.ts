import * as express from "express";

import { db } from "../db";

const usersRouter = express.Router();

usersRouter.post("/", (req, res) => {
  db.all("SELECT 1 + 1;", (err, results: string) => {
    if (err) {
      console.error(err);
      res.send(err);
      return;
    }

    res.send(results);
  });

  res.send(req.body);
});

export { usersRouter };
