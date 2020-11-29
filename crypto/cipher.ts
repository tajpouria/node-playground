import * as crypto from "crypto";

const cipher = crypto.createCipheriv(
  "aes-256-ecb",
  "w9z$C&F)H@McQfTjWnZr4u7x!A%D*G-K",
  null,
);

let d = cipher.update("sth", "utf8", "base64");

d += cipher.final("base64");

console.log(d);
