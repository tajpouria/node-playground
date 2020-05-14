import * as Joi from "joi";

const username = Joi.string()
  .alphanum()
  .min(3)
  .max(30)
  .required();

const password = Joi.string()
  .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
  .options({
    language: {
      string: {
        regex: {
          base:
            "must be between 6-16 characters, " +
            "have at least one capital letter, " +
            "one lowercase letter, one digit, " +
            "and one special character"
        }
      }
    }
  });

const repeatPassword = Joi.ref("password");

const email = Joi.string().email();

export const userValidators = {
  signUp: Joi.object({ username, email, password, repeatPassword }),
  signIn: Joi.object({ username, password })
};
