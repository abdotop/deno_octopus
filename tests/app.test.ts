import { assertEquals } from "jsr:@std/assert";
import { App } from "../index"; // Adjust the import path as necessary

Deno.test(
  "App should respond with 'Hello, world!' for GET requests",
  async () => {
    const app = new App();
    const port = 3000;

    // Add a route to the app
    app.get("/", (ctx) => {
      ctx.set("Content-Type", "text/plain");
      return ctx.send("Hello, world!");
    });

    // Start the app
    app.run({ port });

    // Give the server some time to start
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Make a request to the server
    const response = await fetch(`http://localhost:${port}`);
    const text = await response.text();

    // Check the response
    assertEquals(response.status, 200);
    assertEquals(text, "Hello, world!");

    // Stop the server
    app.close();
  },
);

Deno.test(
  "App should respond with 'Data received' for POST requests",
  async () => {
    const app = new App();
    const port = 3000;

    // Add a route to the app
    app.post("/", (ctx) => {
      ctx.set("Content-Type", "text/plain");
      return ctx.send("Data received");
    });

    // Start the app
    app.run({ port });

    // Give the server some time to start
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Make a POST request to the server
    const response = await fetch(`http://localhost:${port}`, {
      method: "POST",
      body: "Some data",
    });
    const text = await response.text();

    // Check the response
    assertEquals(response.status, 200);
    assertEquals(text, "Data received");

    // Stop the server
    app.close();
  },
);

Deno.test(
  "App should respond with 'Method not allowed' for unsupported methods",
  async () => {
    const app = new App();
    const port = 3000;

    // Add a route to the app
    app.get("/", (ctx) => {
      ctx.set("Content-Type", "text/plain");
      return ctx.send("Hello, world!");
    });

    // Start the app
    app.run({ port });

    // Give the server some time to start
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Make a POST request to the server
    const response = await fetch(`http://localhost:${port}`, {
      method: "POST",
    });
    const text = await response.text();

    // Check the response
    assertEquals(response.status, 405);
    assertEquals(text, "Method not allowed");

    // Stop the server
    app.close();
  },
);

Deno.test(
  "App should respond with 'Not found' for unknown routes",
  async () => {
    const app = new App();
    const port = 3000;

    // Add a route to the app
    app.get("/", (ctx) => {
      ctx.set("Content-Type", "text/plain");
      return ctx.send("Hello, world!");
    });

    // Start the app
    app.run({ port });

    // Give the server some time to start
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Make a request to an unknown route
    const response = await fetch(`http://localhost:${port}/unknown`);
    const text = await response.text();

    // Check the response
    assertEquals(response.status, 404);
    assertEquals(text, "Not found");

    // Stop the server
    app.close();
  },
);

//   test the use method
Deno.test(
  "App should respond with 'Hello, world!' for GET requests with the use method",
  async () => {
    const app = new App();
    const port = 3000;

    // Add a route to the app
    app.use("/", (ctx) => {
      ctx.set("Content-Type", "text/plain");
      if (ctx.req.method === "GET") {
        console.log(ctx.req.method);

        return ctx.next();
      }
      return ctx.send("Hello, world!");
    });

    app.get("/", (ctx) => {
      return ctx.send("Hello, Get!");
    });

    app.post("/", (ctx) => {
      return ctx.send("Hello, Post!");
    });

    // Start the app
    app.run({ port });

    // Give the server some time to start
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Make a request to the server
    const response = await fetch(`http://localhost:${port}`);
    const text = await response.text();

    // Check the response for GET
    assertEquals(response.status, 200);
    assertEquals(text, "Hello, Get!");

    // check the response for POST
    const response2 = await fetch(`http://localhost:${port}`, {
      method: "POST",
    });

    const text2 = await response2.text();

    assertEquals(response2.status, 200);
    assertEquals(text2, "Hello, world!");

    // Stop the server
    app.close();
  },
);
