const Redis = require("ioredis");
const { createServer } = require("http");
const { TaskQueue } = require("./task-queue");

const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:8080",
  },
});

const redis = new Redis();

const taskQueue = new TaskQueue(redis);

io.on("connection", async (socket) => {
  socket.on("INIT_TASK", async () => {
    await taskQueue.appendTask({ timeout: Math.random() * 5 });
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`),
);

const subscriber = redis.duplicate();
subscriber.config("SET", "notify-keyspace-events", "Ex");
const EVENT_SET = "__keyevent@0__:set";
subscriber.on("message", function (channel, key) {
  console.info(channel, key);
});
subscriber.subscribe(EVENT_SET);
