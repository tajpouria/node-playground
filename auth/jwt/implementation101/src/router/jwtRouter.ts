import express from "express";
import util from "util";
import { readFile, readSync } from "fs";

import { User, IUser } from "../models/user";
import { generateJWTTokens, verifyToken } from "../utils";

const jwtRouter = express.Router();

jwtRouter.get("/", (_, res) => {
  res.sendFile(`${process.cwd()}/src/static/jwt.html`);
});

jwtRouter.post("/login", async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role)
    return res.status(400).json({ ok: false });

  try {
    const existingUser = (await User.findOne({ username })) as IUser | null;

    if (existingUser) {
      if (!existingUser.comparePasswords(password))
        return res.status(400).json({ ok: false });

      const { accessToken, refreshToken } = generateJWTTokens(existingUser, {});

      await User.updateOne({ username }, { $set: { token: refreshToken } });

      res.setHeader("Set-Cookie", [
        `token=${accessToken}; HttpOnly; SameSite=Lax; Path=/;`,
      ]);

      return res.status(201).json({ token: refreshToken });
    }

    const { accessToken, refreshToken } = generateJWTTokens(
      { username, role },
      {},
    );

    const newUser = new User({ username, password, role, token: refreshToken });

    await newUser.save();

    res.setHeader("Set-Cookie", [
      `token=${accessToken}; HttpOnly; SameSite=Lax; Path=/;`,
    ]);

    return res.status(201).json({ token: refreshToken });
  } catch (error) {
    res.status(500).send("<h1>Internal Server Error</h1>");
  }
});

jwtRouter.get("/lobby", async (req, res) => {
  const { token } = req.cookies;

  try {
    const user = verifyToken(token) as { username: string; role: string };

    debugger;

    if (!token || !user?.role || !user?.username)
      return res.status(401).send("<h1>Unauthorized</h1>");

    const html = (
      await util.promisify(
        readFile,
      )(`${process.cwd()}/src/static/jwtLobby.html`, { encoding: "utf-8" })
    )
      .replace("%USER%", user.username)
      .replace("%ROLE%", user.role);

    res.setHeader("Content-Type", "text/html");

    res.send(html);
  } catch (error) {
    if (error.message.includes("expired"))
      return res.sendStatus(401).send("<h1>UnAuthorized</h1>");

    res.sendStatus(500);
  }
});

jwtRouter.post("/token", async (req, res) => {
  const { token } = req.body;
  try {
    const user = (await User.findOne({ token })) as IUser | null;

    if (!token || !user) return res.sendStatus(400);

    let decodedUser: object | null = {};
    if ((decodedUser = verifyToken(user.token) as object)) {
      const { accessToken, refreshToken } = generateJWTTokens(
        decodedUser as { username: string; role: string },
        {},
      );

      res.setHeader("Set-Cookie", [
        `token=${accessToken}; HttpOnly; SameSite=Lax, Path=/;`,
      ]);

      await User.updateOne({ token }, { $set: { token: refreshToken } });

      return res.status(201).json({ token: refreshToken });
    }

    return res.sendStatus(400);
  } catch (error) {
    res.sendStatus(500);
  }
});

export { jwtRouter };
