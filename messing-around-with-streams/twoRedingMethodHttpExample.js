http = require("http");

/*
 * Flow
http
  .get("http://jsonplaceholder.typicode.com/todos/1", resp => {
    let data = "";

    // A chunk of data has been recieved.

    resp.on("data", chunk => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on("end", () => {
      console.log(JSON.parse(data));
    });
  })
  .on("error", err => {
    console.log("Error: " + err.message);
  });
  */

// Pause

http.get("http://jsonplaceholder.typicode.com/todos/1", resp => {
  let data = "";
  let chunk;

  resp.on("readable", () => {
    while ((chunk = resp.read()) != null) {
      data += chunk;
    }
  });

  resp.on("end", () => {
    console.info(JSON.parse(data));
  });
});
