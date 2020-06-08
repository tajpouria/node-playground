import { Application, Router, Context } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const router = new Router();

const test = (ctx: Context) => {
  ctx.response.body = "Hello World";
};

router.get("/api/v1/products", test);

const port = 5000;
const app = new Application();
app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

console.log(`server running on port ${port}`);
await app.listen({
  port,
});
