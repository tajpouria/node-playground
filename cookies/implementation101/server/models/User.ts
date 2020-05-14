import * as mongoose from "mongoose";
import * as bcrypt from "bcryptjs";

interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  doesNotExist: (field: Partial<IUser>) => Promise<boolean>;
  comparePasswords: (password: string) => boolean;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      validate: {
        validator: (username: string) => User.doesNotExist({ username }),
        message: "Username already exists"
      }
    },
    email: {
      type: String,
      validate: {
        validator: (email: string) => User.doesNotExist({ email }),
        message: "Email already exists"
      }
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

userSchema.pre("save", function() {
  if (this.isModified("password"))
    this.password = bcrypt.hashSync(this.password);
});

userSchema.statics.doesNotExist = async function(field: Partial<IUser>) {
  return (await this.where(field).countDocuments()) === 0;
};

userSchema.methods.comparePasswords = function(password: string) {
  return bcrypt.compareSync(password, this.password);
};

export const User = mongoose.model("User", userSchema);
