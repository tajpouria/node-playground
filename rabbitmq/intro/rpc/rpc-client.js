const amqp = require("amqplib/callback_api");

var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: rpc_client.js num");
  process.exit(1);
}

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

    const queue = "rpc_queue";

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

        const correlationId = Math.random().toString();
        const num = parseInt(args[0]);

        console.log(" [x] Requesting fib(%d)", num);

        channel.consume(
          q.queue,
          function (msg) {
            if (msg.properties.correlationId == correlationId) {
              console.log(" [.] Got %s", msg.content.toString());
              setTimeout(function () {
                connection.close();
                process.exit(0);
              }, 500);
            }
          },
          {
            noAck: true,
          },
        );

        channel.sendToQueue(queue, Buffer.from(num.toString()), {
          correlationId: correlationId,
          replyTo: q.queue,
        });
      },
    );
  });
});
