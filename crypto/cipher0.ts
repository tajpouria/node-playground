import * as crypto from "crypto";

const KEY = "w9z$C&F)H@McQfTjWnZr4u7x!A%D*G-K",
  IV = crypto.randomBytes(16);

const cipher = crypto.createCipheriv("aes-256-cbc", KEY, IV);

let d = cipher.update("Because the string was too short", "utf8", "hex");

d += cipher.final("hex");

console.info(`Ciphered: ${d}`);

const dCipher = crypto.createDecipheriv("aes-256-cbc", KEY, IV);

let dc = dCipher.update(d, "hex", "utf8");

dc += dCipher.final("utf-8");

console.info(`DCiphered: ${dc}`);
