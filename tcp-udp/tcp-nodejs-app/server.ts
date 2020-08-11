import net from "net";

const { PORT = "7070", HOST = "127.0.0.1" } = process.env;

const server = net.createServer();

server.listen(+PORT, HOST, () => {
  console.info(`TCP server running on host:${HOST}, port:${PORT}`);
});

const sockets: Record<string, net.Socket> = Object.create(null);

server.on("connection", s => {
  const sAddr = `${s.remoteAddress}:${s.remotePort}`;

  sockets[sAddr] = s;
  console.info(`Connected, ${sAddr}`);

  s.on("data", data => {
    console.info(`Data, ${sAddr}, `);

    for (let _s in sockets) {
      sockets[_s].write(data);

      console.info(`Broadcast, ${_s}, ${data.toString("utf-8")}`);
    }
  });

  s.on("close", err => {
    if (err) console.error(`Close, ${sAddr}, Error`);
    delete sockets[sAddr];
    console.info(`Close, ${sAddr}`);
  });
});

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));
