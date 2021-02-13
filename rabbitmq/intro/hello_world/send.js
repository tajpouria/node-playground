const amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost:5672", function (error0, connection) {
  if (error0) {
    console.error(error0);
    process.exit(1);
  }

  connection. (function (error1, channel) {
    if (error1) {
      console.error(error1);
      process.exit(1);
    }

    const queue = "hello";
    const msg = "Hello world";

    channel.assertQueue(queue, {
      durable: false,
    });

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);

    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  });
});
