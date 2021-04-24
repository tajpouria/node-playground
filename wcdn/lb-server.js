const http = require("http");

const ports = process.argv.slice(2);

if (!ports.length) {
  console.error(
    "Usage: node lb-server.js <server type p: primary | b: backup>_<server port>_<server_response status>",
  );
  console.error("Example: node lb-server.js p_4000_200 p_4001_503 b_4002_200");

  process.exit(1);
}

for (const p of ports) {
  const [type, port, status] = p.split("_");
  switch (type) {
    // Primary server
    case "p":
      http
        .createServer((_, res) =>
          reqHandler(_, res, parseInt(status, 10), { type, port }),
        )
        .listen(parseInt(port, 10));
      console.info(introduce(type, port));
      continue;

    // Backup server
    case "b":
      http
        .createServer((_, res) =>
          reqHandler(_, res, parseInt(status, 10), { type, port }),
        )
        .listen(parseInt(port, 10));
      console.info(introduce(type, port));
      continue;
  }
}

function reqHandler(_, res, status, { type, port }) {
  res.writeHead(status, { "Content-Type": "text/html" });
  res.write(`<h1>${introduce(type, port)}, Status: ${status}</h1>`);
  res.end();
}

function introduce(type, port) {
  return `${
    type === "p" ? "Primary" : "Backup"
  } server running on port ${port}`;
}
