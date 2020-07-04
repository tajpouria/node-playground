import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "../../../deno-cors/mod.ts";

const books = new Map<string, any>();
books.set("1", {
  id: "1",
  title: "Frankenstein",
  author: "Mary Shelley",
});

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "Hello world!";
  })
  .get("/book", async (context) => {
    await new Promise((res) => setTimeout(res, 4000));

    context.response.body = Array.from(books.values());
  })
  .get("/book/:id", (context) => {
    if (context.params && context.params.id && books.has(context.params.id)) {
      context.response.body = books.get(context.params.id);
    }
  });

const app = new Application();
app.use(oakCors()); // Enable All CORS Requests

app.use(router.routes());

console.info(`CORS-enabled web server listening on port 4000`);
await app.listen({ port: 4000 });
