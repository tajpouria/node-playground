import * as express from "express";
import * as Joi from "joi";

import { userValidators } from "../validators";
import { User } from "../models";
import { sessionizedUser, parseError } from "../helpers";

const usersController = express.Router();

usersController.post("/", async (req, res) => {
  try {
    await Joi.validate(req.body, userValidators.signUp);

    const newUser = new User(req.body);
    await newUser.save();

    const sessionUser = sessionizedUser(newUser);

    req.session.user = sessionUser;

    res.status(201).send(sessionUser);
  } catch (err) {
    res.status(400).send(parseError(err));
  }
});

export { usersController };
