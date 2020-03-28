// e.g.1
import * as util from "util";
import * as fs from "fs";

const readFileAsync = util.promisify(fs.readFile);

readFileAsync("geekfile.txt", { encoding: "utf8" })
  // Callback just receive one argument 'txt'
  .then(txt => console.info(txt))
  .catch(err => console.error(err));

// e.g.2

import * as dns from "dns";

const lookupAsync = util.promisify(dns.lookup);

(async () => {
  // Call back receives more than one argument so the response is an fulfilled with all arguments
  const args = await lookupAsync("nodejs.org");

  console.log(args); // {address: "104.20.23.46", family: 4}
})();
