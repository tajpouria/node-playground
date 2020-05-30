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
  .get("/book", (context) => {
    context.response.body = Array.from(books.values());
  })
  .get("/book/:id", (context) => {
    if (context.params && context.params.id && books.has(context.params.id)) {
      context.response.body = books.get(context.params.id);
    }
  })
  .post("/book", async (context) => {
    const {
      value: { id, title, author },
    } = await context.request.body();

    books.set(id, { id, title, author });

    context.response.body = { id, title, author };
  })
  .put("/book/:id", async (context) => {
    const { value } = await context.request.body();

    if (context.params?.id && books.has(context.params.id)) {
      books.set(context.params.id, {
        ...books.get(context.params.id),
        ...value,
      });
      context.response.body = { ok: 1 };
    } else {
      context.response.body = { ok: 0 };
    }
  })
  .delete("/book/:id", (context) => {
    if (context.params && context.params.id && books.has(context.params.id)) {
      books.delete(context.params.id);
      context.response.body = { ok: 1 };
    } else {
      context.response.body = { ok: 0 };
    }
  });

const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());

console.info(`CORS-enabled web server listening on port 8000`);
await app.listen({ port: 8000 });

/*
// Examples

// GET
fetch("http://localhost:8000/book")
  .then((res) => res.text())
  .then((res) => console.log(res));

// GET BY ID
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

// PUT
fetch("http://localhost:8000/book/1", {
method: "PUT",
body: JSON.stringify({
  title: "A Study In Scarlet",
  author: "Arthur Conan Doyle",
}),
headers: { "Content-Type": "application/json" },
})
.then((res) => res.json())
.then((res) => console.log(res));


// DELETE
fetch("http://localhost:8000/book/1", { method: "DELETE" })
  .then((res) => res.json())
  .then((res) => console.log(res));
*/
