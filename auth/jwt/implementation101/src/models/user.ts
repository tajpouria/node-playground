import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends mongoose.Document {
  username: string;
  password: string;
  role: "user" | "admin";
  comparePasswords: (password: string) => boolean;
  token: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },

    token: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

userSchema.pre<IUser>("save", function () {
  if (this.isModified("password"))
    this.password = bcrypt.hashSync(this.password);
});

userSchema.methods.comparePasswords = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};

export const User = mongoose.model("User", userSchema);
