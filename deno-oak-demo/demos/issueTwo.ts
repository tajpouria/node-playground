import { Application, Router } from "https://deno.land/x/oak@v4.0.0/mod.ts";
import { oakCors } from "../../../deno-cors/mod.ts";

const books = new Map<string, any>();
books.set("1", {
  id: "1",
  title: "Frankenstein",
  author: "Mary Shelley",
});

const router = new Router();
router.get("/", (context) => {
  context.response.body = "Hello world!";
});

const app = new Application();

app.use(oakCors()); // Enable All CORS Requests

app.use(router.routes());

console.info(`CORS-enabled web server listening on port 8000`);
await app.listen({ port: 8000 });
