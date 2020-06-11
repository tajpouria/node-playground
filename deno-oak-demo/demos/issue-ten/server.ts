import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { multiParser } from "https://raw.githubusercontent.com/deligenius/multiparser/master/mod.ts";

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
  .post("/book", async (context) => {
    const formData = await multiParser(context.request.serverRequest);

    if (
      typeof formData?.title === "string" &&
      typeof formData.author === "string"
    ) {
      const id = (books.size + 1).toString();
      const { title, author } = formData;

      books.set(id, { id, title, author });

      context.response.status = 201;
    } else {
      context.response.status = 400;
    }
  });

const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());

console.info(`CORS-enabled web server listening on port 8000`);
await app.listen({ port: 8000 });
