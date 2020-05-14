import * as express from "express";
import * as Joi from "joi";

import { userValidators } from "../validators";
import { User } from "../models";

const usersController = express.Router();

usersController.post("/", async (req, res) => {
  try {
    await Joi.validate(req.body, userValidators.signUp);

    const newUser = new User(req.body);

    await newUser.save();

    res.send({ id: newUser.id, username: req.body.username });
  } catch (err) {
    res.status(400).send(err);
  }
});

export { usersController };
