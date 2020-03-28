import * as events from "events";

(async () => {
  const ee = new events.EventEmitter();

  process.nextTick(() => {
    ee.emit("my event", 42);
  });

  const [value] = await events.once(ee, "my event");

  console.log(value);

  process.nextTick(() => {
    const err = new Error("kaboom");
    ee.emit("error", err);
  });

  try {
    await events.once(ee, "my event");
  } catch (err) {
    console.error(err);
  }
})();
