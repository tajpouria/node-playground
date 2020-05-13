import * as express from "express";
import * as dotenv from "dotenv";

import { usersRouter } from "./routers";

dotenv.config();

const app = express();

app.disable("x-powered-by");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const apiRouter = express.Router();

app.use("/api", apiRouter);
apiRouter.use("/users", usersRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.info(`Listening on port ${port}`);
});
