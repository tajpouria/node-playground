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

    const queue = "rpc_queue";

    channel.assertQueue(queue, {
      durable: true,
    });

    channel.prefetch(1);

    console.log(
      " [*] Awaiting RPC requests in %s. To exit press CTRL+C",
      queue,
    );
    channel.consume(
      queue,
      function (msg) {
        const n = parseInt(msg.content.toString());

        console.log(" [.] fib(%d)", n);

        const r = fibonacci(n);

        channel.sendToQueue(msg.properties.replyTo, Buffer.from(r.toString()), {
          correlationId: msg.properties.correlationId,
        });

        channel.ack(msg);
      },
      {
        noAck: false,
      },
    );
  });
});

function fibonacci(n) {
  if (n == 0 || n == 1) return n;
  else return fibonacci(n - 1) + fibonacci(n - 2);
}
