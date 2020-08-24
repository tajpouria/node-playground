import { createWriteStream, createReadStream, readFile, fstat, read } from "fs";
import { createServer } from "http";
import { Http2ServerRequest } from "http2";
import { Stream } from "stream";

const file = createWriteStream("big-file.txt");

for (let i = 0; i <= 1e6; i++) {
  file.write("Look what I used to create that big file. A writable stream!");
}
file.end();

const readable = createReadStream("file.txt"); // In pause mode
readable.on("data", () => {}); // Switch to flowing mode

readable.resume(); // Lose data

// const server = createServer((req, res) => {
//   readFile("./big-file.txt", (err, data) => {
//     if (err) {
//       res.writeHead(500);
//       res.end();
//       return;
//     }

//     res.end(data);
//   });
// });

// const server = createServer((_req, res) => {
//   const readable = createReadStream("./big-file.txt");

//   readable.pipe(res);
// });

// server.listen(8080, "127.0.0.1", () =>
//   console.info("Listening on port 8080..."),
// );
