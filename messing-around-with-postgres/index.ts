import "dotenv/config";
import { Client } from "pg";

const client = new Client();

(async () => {
  try {
    await client.connect();
    console.log("connected successfully");
  } catch (error) {
    console.error(error);
  }
})();
