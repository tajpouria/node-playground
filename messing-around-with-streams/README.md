# Why streams

Streams provides two major advantages compared to other data handling methods:

1. Memory efficiency: You don't need to load large amount of data inside the memory before you are able to process it
2. Time efficiency: Obviously it take significantly less time to start processing a chunk of data before it's entirely loaded

## Different types of streams

1. Writeable: e.g. `fs.createWriteStream('./file.txt')`
2. Readable: e.g. `fs.createReadStream('./file.txt')`
3. Duplex: e.g. `net.Socket()` Both read from and write in a file
4. Transform :

## Using Streams with asynchronous iterators

[`streamsWithAsyncIterators`](./streamsWithAsyncIterators)

## Stream two reading modes

[`ReadingModes.js`](ReadingModes.js)

Readable stream effectively operate in one of the following reading modes:

1. `Flow`: Data is reading from underlying system automatically and provide to an application as soon as possible using using events via the event Emitter interface

2. `Pause`: In pause mode we just need to call `read()` function repeatedly on `readable`event until the `end` event get emitted

An readable stream start in `pause` mode and we can it mode to flow using one of the following ways:

- listening for `data` event
- calling `resume()`
- calling `pipe()`

It's also possible to back in `pause` mode using:

- If there was no pipe destinations calling `pause()`
- If there was pipe destinations by removing all pipe destinations, multiple pipe destinations can removed by calling `stream.unpipe()`

## Writeable Stream
  

`fs.createWriteStram()` provides `write()` can be used to write data to the stream 
The `write()` will return either true or false indicate that writing data was successful or we can not write data  at the moment, Use `writeable.end()` as a signal to that no more data should be written in the writeable

[writStream](./writStream)


