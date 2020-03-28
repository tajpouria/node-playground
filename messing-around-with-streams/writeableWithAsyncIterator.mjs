import * as util from "util";
import * as fs from "fs";
import * as stream from "stream";
import { once } from "events";
import * as assert from "assert";

const finished = util.promisify(stream.finished);

async function writeIterableToFile(iterable, filePath) {
  const writeable = fs.createWriteStream(filePath, { encoding: "utf-8" });

  for await (const chunk of iterable) {
    if (!writeable.write(chunk)) {
      await once(writeable, "drain");
    }
  }

  writeable.end();

  await finished(writeable);
}

(async () => {
  await writeIterableToFile(["some", "data"], "example.txt");
  assert.equal(
    fs.readFileSync("example.txt", { encoding: "utf-8" }),
    "somedata"
  );
})();
