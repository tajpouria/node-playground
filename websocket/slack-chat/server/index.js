const { InMemoryMessageStore } = require("../message-store");
const { InMemorySessionStore } = require("./session-store");
const sessionStore = new InMemorySessionStore();
const messageStore = new InMemoryMessageStore();

/**
 * {
 *  sessionID: {
 *  userID
 * }
 * }
 */

/**
 * messageStore: {
 *    userID:[
 *     { content, from, to }
 *  ]
 * }
 */

const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:8080",
  },
});

function calcContacts(userID) {
  const users = [];
  for (const user of sessionStore.findAllSessions()) {
    const messages = [];
    for (const msg of messageStore.store.get(userID) || []) {
      if (msg.to === user.userID || msg.from === user.userID) {
        messages.push(msg);
      }
    }
    user.messages = messages;
    users.push(user);
  }
  return users;
}

io.use((socket, next) => {
  const sessionID = parseFloat(socket.handshake.auth.sessionID);
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.username = session.username;
      socket.userID = session.userID;
      return next();
    }
  }

  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }

  const newSessionID = Math.random();
  const userID = Math.random();
  socket.sessionID = newSessionID;
  socket.username = username;
  socket.userID = userID;
  sessionStore.saveSession(newSessionID, {
    username,
    userID,
    connected: true,
  });
  next();
});

io.on("connection", (socket) => {
  socket.emit("session", {
    sessionID: socket.sessionID,
    username: socket.username,
    userID: socket.userID,
  });

  socket.join(socket.userID);

  sessionStore.saveSession(socket.sessionID, {
    ...sessionStore.findSession(socket.sessionID),
    connected: true,
  });

  const users = calcContacts(socket.userID);
  socket.emit("users", users);
  socket.broadcast.emit("users", users);

  socket.on("private message", ({ content, to }) => {
    const msg = {
      content,
      from: socket.userID,
      to,
    };
    messageStore.append(socket.userID, msg);
    messageStore.append(to, msg);
    socket.to(to).emit("private message", msg);
  });

  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      sessionStore.saveSession(socket.sessionID, {
        ...sessionStore.findSession(socket.sessionID),
        connected: false,
      });
    }
    socket.broadcast.emit("users", calcContacts(socket.userID));
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`),
);
