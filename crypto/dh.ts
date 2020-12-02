import * as crypto from "crypto";
import assert from "assert";

const server = crypto.createDiffieHellman(1024);
const prime = server.getPrime();

// Generate Alice's keys
const alice = crypto.createDiffieHellman(prime);
alice.generateKeys();
const alicePublicKey = alice.getPublicKey("base64");

// Generate Bob's keys
const bob = crypto.createDiffieHellman(prime);
bob.generateKeys();
const bobPubicKey = bob.generateKeys("base64");

assert.notStrictEqual(
  alicePublicKey.toString(),
  bobPubicKey.toString(),
  "Alice and Bob publics are equivalent",
);

// Exchange and generate the secret
const aliceBobSecret = alice.computeSecret(bobPubicKey, "base64");
const bobAliceSecret = bob.computeSecret(alicePublicKey, "base64");

assert.strictEqual(
  aliceBobSecret.toString("hex"),
  bobAliceSecret.toString("hex"),
  "Alice and Bob secrets are not equivalent.",
);
