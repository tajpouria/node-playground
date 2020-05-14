import { ValidationError } from "joi";

import { IUser } from "../models/User";

export const parseError = (err: ValidationError) => {
  if (err.isJoi) return err.details[0];
  return JSON.stringify(err, Object.getOwnPropertyNames(err));
};

export const sessionizedUser = (user: IUser) => ({
  userId: user.id,
  username: user.username
});
