const Stream = require("stream");

const readAbleStream = new Stream.Readable();

readAbleStream.push("ping");
readAbleStream.push("pong");
