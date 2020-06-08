import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

interface Book {
  id: string;
  title: string;
  author: string;
}

const books = new Map<string, Book>();
books.set("1", {
  id: "1",
  title: "Frankenstein",
  author: "Mary Shelley",
});

const router = new Router();
router
  .get("/book", oakCors(), (context) => {
    context.response.body = Array.from(books.values());
  })
  .options("/book", oakCors())
  .post("/book", oakCors(), async (context) => {
    const {
      value: { id, title, author },
    } = await context.request.body();

    books.set(id, { id, title, author });

    context.response.body = { id, title, author };
  });

const app = new Application();
app.use(router.routes());

console.info(`CORS-enabled web server listening on port 8000`);
await app.listen({ port: 8000 });

/*
// Examples

// GET
fetch("http://localhost:8000/book")
  .then((res) => res.text())
  .then((res) => console.log(res));

// POST
fetch("http://localhost:8000/book", {
  method: "POST",
  body: JSON.stringify({
    id: "2",
    title: "A Study In Scarlet",
    author: "Arthur Conan Doyle",
  }),
  headers: { "Content-Type": "application/json" },
})
  .then((res) => res.json())
  .then((res) => console.log(res));
*/
