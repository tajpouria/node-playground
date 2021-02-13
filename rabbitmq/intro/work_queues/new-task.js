const amqp = require("amqplib/callback_api");
const msg = process.argv.slice(2).join(" ") || "Hello World!";

amqp.connect("amqp://localhost:5672", function (error0, connection) {
  if (error0) {
    console.error(error0);
    process.exit(1);
  }

  connection.createChannel(function (error1, channel) {
    if (error1) {
      console.error(error1);
      process.exit(1);
    }

    const queue = "task_queue";

    channel.assertQueue(queue, {
      durable: true,
    });

    channel.sendToQueue(queue, Buffer.from(msg), {
      persistent: true,
    });
    console.log(" [x] Sent '%s'", msg);

    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  });
});
