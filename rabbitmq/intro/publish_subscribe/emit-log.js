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
    const msg = process.argv.slice(2).join(" ") || "Hello World!";

    channel.assertExchange(exchange, "fanout", {
      durable: false,
    });
    channel.publish(exchange, "", Buffer.from(msg));
    console.log(" [x] Sent %s", msg);

    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  });
});
