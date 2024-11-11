import { App } from "./app.ts";

const app = new App();
const port = 3000;

app.use("/", async (ctx) => {
  ctx.set("Content-Type", "text/plain");
  if (ctx.req.method === "GET") {
    return ctx.next();
  }
  return ctx.send("Hello, world!", 201);
});

app.get("/", async (ctx) => {
  return ctx.send("Hello, Get!");
});

app.post("/test", async (ctx) => {
  // return ctx.send("Hello, Post!");
  const value = ctx.get('Authorization');
  console.log(value)
  if (value == "Bearer 123"){
    return ctx.next()
  }
  ctx.send("not authorized",401)
},(ctx)=>{
  ctx.send("Hello, Post!")
});

app.run({ port });