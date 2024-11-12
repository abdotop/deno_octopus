import { Ctx } from "./context.ts";
import {
  App as app,
  Config,
  ServerError,
  HandlerFunc,
  Routes,
} from "./types/types.ts";

export class App extends app {
  #router: Routes;
  #middleware: Routes;
  private controller = new AbortController();
  constructor() {
    super();
    this.#middleware = new Map();
    this.#router = new Map();
  }

  #ServeHTTP = async (req: Request): Promise<Response> => {
    try {
      const { url, method } = req;
      const path = new URL(url).pathname;
      const route = this.#router.get(path);
      if (!route) {
        throw new ServerError("Not found", 404);
      }
      const handlers = route.get(method);
      if (!handlers) {
        throw new ServerError("Method not allowed", 405);
      }
      const ctx = new Ctx(req, new Headers(), handlers);
      await ctx.next();
      return ctx.clone();
    } catch (error: unknown) {
      if (error instanceof ServerError) {
        return new Response(error.message, { status: error.statusCode });
      } else if (error instanceof Error) {
        return new Response(error.message, { status: 500 });
      } else {
        return new Response("Internal Server Error", { status: 500 });
      }
    }
  };

  run(cfg: Config): void {
    Deno.serve({ ...cfg, signal: this.controller.signal }, this.#ServeHTTP);
  }

  close(): void {
    this.controller.abort();
  }

  use(path: string, ...handlers: HandlerFunc[]): void {
    this.#middleware.set(path, new Map().set("USE", handlers));
  }

  get(path: string, ...handlers: HandlerFunc[]): void {
    const route = this.#router.get(path) || new Map();
    const _handlers = this.#middleware.get(path)?.get("USE");
    if (_handlers) {
      handlers = [..._handlers, ...handlers];
    }
    route.set("GET", handlers);
    this.#router.set(path, route);
  }

  post(path: string, ...handlers: HandlerFunc[]): void {
    const route = this.#router.get(path) || new Map();
    const _handlers = this.#middleware.get(path)?.get("USE");
    if (_handlers) {
      handlers = [..._handlers, ...handlers];
    }
    route.set("POST", handlers);
    this.#router.set(path, route);
  }

  put(path: string, ...handlers: HandlerFunc[]): void {
    const route = this.#router.get(path) || new Map();
    const _handlers = this.#middleware.get(path)?.get("USE");
    if (_handlers) {
      handlers = [..._handlers, ...handlers];
    }
    route.set("PUT", handlers);
    this.#router.set(path, route);
  }

  delete(path: string, ...handlers: HandlerFunc[]): void {
    const route = this.#router.get(path) || new Map();
    const _handlers = this.#middleware.get(path)?.get("USE");
    if (_handlers) {
      handlers = [..._handlers, ...handlers];
    }
    route.set("DELETE", handlers);
    this.#router.set(path, route);
  }
}
