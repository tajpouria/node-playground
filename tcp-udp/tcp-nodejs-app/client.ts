import net from "net";

const s = new net.Socket();

const { PORT = "8080", HOST = "127.0.0.1" } = process.env;

s.connect(+PORT, HOST, () => {
  console.info(`Connected, ${HOST}:${PORT}`);

  s.write(`Client Hello, ${JSON.stringify(s.address())}`);
});

s.on("data", data => {
  console.info(`data, ${data.toString()}`);
});

s.on("close", err => {
  if (err) console.info("Close, error");

  console.info("Close");
});
