const amqp = require("amqplib/callback_api");

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
  process.exit(1);
}

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

    const exchange = "direct_logs";

    channel.assertExchange(exchange, "direct", {
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
        args.forEach(function (severity) {
          channel.bindQueue(q.queue, exchange, severity);
        });

        channel.consume(
          q.queue,
          function (msg) {
            console.log(
              " [x] %s: '%s'",
              msg.fields.routingKey,
              msg.content.toString(),
            );
          },
          {
            noAck: true,
          },
        );
      },
    );
  });
});
