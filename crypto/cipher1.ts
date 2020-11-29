import * as crypto from "crypto";

const PASS = "Secret Password";

crypto.scrypt(PASS, crypto.randomBytes(16), 24, (err, dk) => {
  if (err) {
    console.error(dk);
    process.exit(1);
  }

  crypto.randomFill(new Uint8Array(16), (err, iv) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    const cipher = crypto.createCipheriv("aes-192-cbc", dk, iv);

    let encrypted = "";
    cipher.setEncoding("hex");

    cipher.on("data", (chunk) => (encrypted += chunk));
    cipher.on("end", () => console.info(encrypted));

    cipher.write(process.argv[2]);
    cipher.end();
  });
});
