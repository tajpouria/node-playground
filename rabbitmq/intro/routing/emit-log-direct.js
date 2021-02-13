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
    const exchange = "direct_logs";
    const args = process.argv.slice(2);
    const msg = process.argv.slice(2).join(" ") || "Hello World!";
    const severity = args.length > 0 ? args[0] : "info";

    channel.assertExchange(exchange, "direct", {
      durable: false,
    });
    channel.publish(exchange, severity, Buffer.from(msg));
    console.log(" [x] Sent %s: '%s'", severity, msg);

    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  });
});
