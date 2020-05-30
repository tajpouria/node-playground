import http, { RequestOptions } from "http";

export const request = ({
  body,
  ...reqOptions
}: RequestOptions & { body?: string }) =>
  new Promise((resolve, reject) => {
    const req = http
      .request(reqOptions, (res) => {
        res.on("error", (err) => reject(err));

        let data = "";
        res.on("data", (chunk) => (data += chunk.toString("utf8")));

        res.on("end", () => resolve(data));
      })
      .on("error", (err) => reject(err));

    if (body)
      req.write(body, () =>
        console.info("Body has been written to the request"),
      );
    req.end();
  });
