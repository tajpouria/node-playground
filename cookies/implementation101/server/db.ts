import * as mongoose from "mongoose";

export const connectToDB = async () => {
  await mongoose.connect(
    `mongodb+srv://tajpouria:${process.env.DB_PASS}@cluster0-xfsa2.mongodb.net/test?retryWrites=true`,
    { useNewUrlParser: true, useUnifiedTopology: true },
    err => {
      if (err) throw err;

      console.info("Connected to DB");
    }
  );
};
