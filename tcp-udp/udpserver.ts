import * as dgram from "dgram";

const socket = dgram.createSocket("udp4");

socket
  .on("message", (msg, rinfo) => {
    console.info(
      `msg ${msg}, rinfo address ${rinfo.address}, rinfo port ${rinfo.port}`
    );
  })
  .bind(8080);
