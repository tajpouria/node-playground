import * as net from "net";

net
  .createServer(socket => {
    socket.write("You Are connected!");

    // I cannont read this comments
    socket.on("data", data => {
      console.info(data.toString());
    });
  })
  .listen(8080);
