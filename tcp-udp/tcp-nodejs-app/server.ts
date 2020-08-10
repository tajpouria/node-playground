import net from "net";

const { PORT = "7070", HOST = "127.0.0.1" } = process.env;

const server = net.createServer();

server.listen(+PORT, HOST, () => {
  console.info(`TCP server running on host:${HOST}, port:${PORT}`);
});
