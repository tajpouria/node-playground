import * as crypto from "crypto";

for (let index = 0; index < crypto.getHashes().length; index++) {
  const alg = crypto.getHashes()[index];
  console.time(alg);

  for (let index1 = 0; index1 < 10000; index1++) {
    crypto.createHash(alg).update("Hello world!").digest("hex");
  }
  console.timeEnd(alg);
}
