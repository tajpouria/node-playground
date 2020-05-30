import { Request, Response, NextFunction } from "express";

export const cors = () => (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin ,X-Requested-With, Content-Type, Accept",
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
};
