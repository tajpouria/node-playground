import { Readable } from "stream";
import * as assert from "assert";

async function readFromStream(readAbleStream) {
  let result = "";

  for await (const chunck of readAbleStream) {
    result += chunck;
  }

  return result;
}

const readable = Readable.from("foobar", { enconding: "utf-8" });

(async () => {
  console.assert(readFromStream(readabel === "foobar"));
})();

// e.g.2

function* generate() {
  yield "foo";
  yield "bar";
}

(async () => {
  const readable2 = Readable.from(generate(), { encoding: "utf-8" });
  assert.equal(await readFromStream(readable2), "foobar");
})();
