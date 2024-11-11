# deno_octopus 

deno_octopus is a lightweight web framework for Deno, designed to simplify the creation and management of HTTP servers. It provides a flexible and extensible structure for handling HTTP requests and responses.

## Installation

To install deno_octopus, you can use the following import statement in your Deno project:

```ts
import { App, Ctx } from "./path/to/deno_octopus";
```

## Usage

### Creating an App
 To create an instance of the App class, you can use the following code:

 ```ts
 import { App } from "./app";

const app = new App();
const port = 3000;

app.use("/", async (ctx) => {
  ctx.set("Content-Type", "text/plain");
  if (ctx.req.method === "GET") {
    return ctx.next();
  }
  return new Response("Hello, world!");
});

app.get("/", async (ctx) => {
  return new Response("Hello, Get!");
});

app.post("/", async (ctx) => {
  return new Response("Hello, Post!");
});

app.run({ port });
```

### Methods
`run(cfg: Config): void`
Starts the server with the specified configuration, listening on the specified port and binding to 0.0.0.0.

`close(): void` Stops the server by aborting the controller signal.

`use(path: string, ...handlers: HandlerFunc[]): void`
Registers middleware handlers for the specified path.

`get(path: string, ...handlers: HandlerFunc[]): void`
Registers GET request handlers for the specified path.

`post(path: string, ...handlers: HandlerFunc[]): void`
Registers POST request handlers for the specified path.

`put(path: string, ...handlers: HandlerFunc[]): void`
Registers PUT request handlers for the specified path.

`delete(path: string, ...handlers: HandlerFunc[]): void`
Registers DELETE request handlers for the specified path.

## Context

The Ctx class implements the Context interface and is used to manage the request and response lifecycle.

### Properties
- `req: Request:` The incoming request object.

- `ok: boolean:` Indicates if the response is successful.

- `redirected: boolean:` Indicates if the response is a redirection.

- `status: number:` The HTTP status code of the response.

- `statusText: string:` The status text of the response.

- `type: ResponseType:` The type of the response.

- `url: string:` The URL of the request.

### Methods

`clone(): Response`
Creates a clone of the current response.

`next(): Promise<void>`
Executes the next handler in the middleware chain.

`send(body: BodyInit, status?: number): void`
Sends a response with the specified body and status code.

`json(data: unknown, status?: number): void`
Sends a JSON response with the specified data and status code.

`append(name: string, value: string): void`
Appends a header to the response.

`delete(name: string): void`
Deletes a header from the response.

`get(name: string): string | null`
Gets the value of a header.

`has(name: string): boolean`
Checks if a header exists.

`set(name: string, value: string): void`
Sets the value of a header.

`getSetCookie(): string[]`
Gets the Set-Cookie headers.

### Example Usage

```ts
import { Ctx } from "./context";

const handler: HandlerFunc = async (ctx) => {
  ctx.set("Content-Type", "application/json");
  ctx.json({ message: "Hello, world!" });
};

const ctx = new Ctx(new Request("http://localhost"), new Headers(), [handler]);
await ctx.next();
const response = ctx.clone();
console.log(response);
```

## Testing
You can find tests for the App class in the app.test.ts file. Here is an example test:

```ts 
import { App } from "../app";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test(
  "App should respond with 'Hello, world!' for GET requests with the use method",
  async () => {
    const app = new App();
    const port = 3000;

    app.use("/", async (ctx) => {
      ctx.set("Content-Type", "text/plain");
      if (ctx.req.method === "GET") {
        return ctx.next();
      }
      return new Response("Hello, world!");
    });

    app.get("/", async (ctx) => {
      return new Response("Hello, Get!");
    });

    app.post("/", async (ctx) => {
      return new Response("Hello, Post!");
    });

    app.run({ port });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await fetch(`http://localhost:${port}`);
    const text = await response.text();

    assertEquals(response.status, 200);
    assertEquals(text, "Hello, Get!");

    const response2 = await fetch(`http://localhost:${port}`, {
      method: "POST",
    });

    const text2 = await response2.text();

    assertEquals(response2.status, 200);
    assertEquals(text2, "Hello, world!");

    app.close();
  },
);
```
## Directory Structure
```
app.ts
context.ts
index.ts
README.md
tests/
  app.test.ts
types/
  app.ts
  context.ts
  Response.ts
  types.ts
```

## License
This project is licensed under the MIT License. See the LICENSE file for details.