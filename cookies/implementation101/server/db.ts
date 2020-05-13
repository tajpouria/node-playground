import * as sqlite3 from "sqlite3";

sqlite3.verbose();

export const db = new sqlite3.Database("./chinook.db", err => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the chinook database.");
});
