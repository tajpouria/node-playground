import * as util from "util";
import * as fs from "fs";

const readFileAsync = util.promisify(fs.readFile);

readFileAsync("geekfile.txt", { encoding: "utf8" })
  .then(txt => console.info(txt))
  .catch(err => console.error(err));
