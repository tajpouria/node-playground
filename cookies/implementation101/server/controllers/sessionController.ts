import * as express from "express";
import { validate } from "joi";

import { userValidators } from "../validators";
import { parseError, sessionizedUser } from "../helpers";
import { User } from "../models/User";

const sessionController = express.Router();

sessionController.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    await validate(req.body, userValidators.signIn);

    const user = await User.findOne({ username });

    if (user && user.comparePasswords(password)) {
      const sessionUser = sessionizedUser(user);
      req.session.user = sessionUser;
      res.send(sessionUser);
    } else {
      throw new Error("Invalid login credentials");
    }
  } catch (err) {
    res.status(401).send(parseError(err));
  }
});

sessionController.delete("/", (req, res) => {
  const { user } = req.session;

  try {
    if (user) {
      res.clearCookie(process.env.SESS_NAME);
      res.status(204).send();
    } else {
      throw new Error("Something went wrong");
    }
  } catch (err) {
    res.status(422).send(parseError(err));
  }
});

sessionController.get("/", (req, res) => {
  res.json({ user: req.session.user });
});

export { sessionController };
