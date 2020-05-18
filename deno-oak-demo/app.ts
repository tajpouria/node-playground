import {
  Application,
  Router,
  RouterMiddleware,
} from "https://deno.land/x/oak/mod.ts";

import { oakCors } from "../../deno-cors/mod.ts";

const env = Deno.env.toObject();
const PORT = env.PORT || 4000;
const HOST = env.HOST || "127.0.0.1";

const router = new Router();
const app = new Application();

app.use(oakCors());

const dogs = [
  { id: 1, name: "foo" },
  { id: 2, name: "bar" },
];

const getDogs: RouterMiddleware = ({ response }) => {
  response.body = dogs;
};

const getDog: RouterMiddleware = ({ response, params }) => {
  try {
    const { name } = params;

    if (name) {
      const dog = dogs.find((d) => d.name.toLowerCase() === name.toLowerCase());

      if (dog) {
        response.status = 200;
        response.body = dog;
        return;
      }
    }
    throw new Error(`Cannot find entity by name ${name}`);
  } catch (err) {
    response.status = 400;
    response.body = err;
  }
};

const addDog: RouterMiddleware = async ({ request, response }) => {
  const body = await request.body();
  //= body.value;

  const name = "Jush";
  console.log(body.value);

  try {
    if (!name) throw new Error('"name" is required');

    const newDog = { id: dogs.length, name };

    dogs.push(newDog);

    response.status = 204;
    response.body = newDog;
  } catch (err) {
    response.status = 400;
    response.body = err;
  }
};

router.get("/dogs", getDogs).get("/dogs/:name", getDog).post("/dogs", addDog);

app.use(router.routes());
app.use(router.allowedMethods());

console.info(`Listening on port ${PORT}`);

await app.listen(`${HOST}:${PORT}`);
