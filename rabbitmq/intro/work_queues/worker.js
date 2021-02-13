const amqp = require("amqplib/callback_api");

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

    channel.prefetch(1);

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(
      queue,
      function (msg) {
        const secs = msg.content.toString().split(".").length - 1;

        console.log(" [x] Received %s", msg.content.toString());

        setTimeout(function () {
          console.log(" [x] Done %s", msg.content.toString());
          channel.ack(msg);
        }, secs * 1000);
      },
      {
        noAck: false,
      },
    );
  });
});
