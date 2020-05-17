import * as mongoose from "mongoose";

export const connectToDB = async () => {
  await mongoose.connect(
    `mongodb://127.0.0.1:27017/imp101`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    err => {
      if (err) throw err;

      console.info("Connected to DB");
    }
  );
};
