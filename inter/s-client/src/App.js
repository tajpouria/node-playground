import React, { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "127.0.0.1:3000";

const s = socketIOClient(ENDPOINT);
s.connect();

export default function ClientComponent() {
  const socket = useRef();

  useEffect(() => {
    s.on("FromAPI", (data) => {});

    socket.current = s;
  }, []);

  return (
    <p>
      <button
        onClick={() => {
          socket.current.emit("INIT_TASK", { timeout: 3000 });
        }}
      >
        INIT INTENSIVE JOB
      </button>
    </p>
  );
}
