const Redis = require("ioredis");
const { setupWorker } = require("@socket.io/sticky");

const { RedisMessageStore } = require("./message-store");
const { RedisSessionStore } = require("./session-store");

const redis = new Redis();

const sessionStore = new RedisSessionStore(redis);
const messageStore = new RedisMessageStore(redis);

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

  adapter: require("socket.io-redis")({
    pubClient: redis,
    subClient: redis.duplicate(),
  }),
});

async function calcContacts(userID) {
  const users = [];
  for (const user of await sessionStore.findAllSessions()) {
    const messages = [];
    const uMessages = (await messageStore.find(userID)) || [];
    for (const msg of uMessages) {
      if (msg.to === user.userID || msg.from === user.userID) {
        messages.push(msg);
      }
    }
    user.messages = messages;
    users.push(user);
  }

  return users;
}

io.use(async (socket, next) => {
  const sessionID = parseFloat(socket.handshake.auth.sessionID);
  if (sessionID) {
    const session = await sessionStore.findSession(sessionID);
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
  await sessionStore.saveSession(newSessionID, {
    username,
    userID,
    connected: true,
  });
  next();
});

io.on("connection", async (socket) => {
  socket.emit("session", {
    sessionID: socket.sessionID,
    username: socket.username,
    userID: socket.userID,
  });

  socket.join(socket.userID);

  const pSession = await sessionStore.findSession(socket.sessionID);
  await sessionStore.saveSession(socket.sessionID, {
    ...pSession,
    connected: true,
  });

  const users = await calcContacts(socket.userID);
  socket.emit("users", users);
  socket.broadcast.emit("users", users);

  socket.on("private message", async ({ content, to }) => {
    const msg = {
      content,
      from: socket.userID,
      to,
    };
    await messageStore.append(msg);
    socket.to(to).emit("private message", msg);
  });

  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      const pSession = await sessionStore.findSession(socket.sessionID);
      sessionStore.saveSession(socket.sessionID, {
        ...pSession,
        connected: false,
      });
    }
    socket.broadcast.emit("users", await calcContacts(socket.userID));
  });
});

setupWorker(io);
