const amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    console.error(error0);
    process.exit(1);
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      console.error(error1);
      process.exit(1);
    }

    const exchange = "logs";

    channel.assertExchange(exchange, "fanout", {
      durable: false,
    });

    channel.assertQueue(
      "",
      {
        exclusive: true,
      },
      function (error2, q) {
        if (error2) {
          console.error(error2);
          process.exit(1);
        }

        console.log(
          " [*] Waiting for messages in %s. To exit press CTRL+C",
          q.queue,
        );
        channel.bindQueue(q.queue, exchange, "");

        channel.consume(
          q.queue,
          function (msg) {
            if (msg.content) {
              console.log(" [x] %s", msg.content.toString());
            }
          },
          {
            noAck: true,
          },
        );
      },
    );
  });
});
