import { App } from "./app.ts";

const app = new App();

app.get("/", (ctx) => {
  ctx.set("Content-Type", "text/plain");
  return ctx.send("Hello, world!");
});

app.get("/socket",  (ctx) => {
  const socket = ctx.to_socket();
  socket.addEventListener("open", () => {
    console.log("a client connected!");
  });

  socket.addEventListener("message", (event) => {
    if (event.data === "ping") {
      socket.send("pong");
    }
  });
});

app.run({ port: 3000 });
