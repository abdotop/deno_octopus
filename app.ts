import { App as app } from "./types/app";
import { Ctx } from "./context";
import type {
  Config,
  Error,
  HandlerFunc,
  Methode,
  Routes,
} from "./types/types";

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
        throw { code: 404, message: "Not found" };
      }

      const handlers = route.get(method as Methode);
      if (!handlers) {
        throw { code: 405, message: "Method not allowed" };
      }
      const ctx = new Ctx(req, new Headers(), handlers);
      await ctx.next();
      return ctx.clone();
    } catch (error: Error) {
      const res = new Response(error.message, { status: error.code });
      return res;
    }
  };

  run(cfg: Config): void {
    const handler = (req: Request) => {
      return this.#ServeHTTP(req);
    };

    // To listen on the specified port and bind to 0.0.0.0.
    Deno.serve({ ...cfg, signal: this.controller.signal }, handler);
  }

  close(): void {
    this.controller.abort();
  }

  use(path: string, ...handlers: HandlerFunc[]): void {
    this.#middleware.set(path, new Map().set("USE", handlers));
  }

  get(path: string, ...handlers: HandlerFunc[]): void {
    const route = this.#router.get(path) || new Map();
    const _handlers = this.#middleware.get(path)?.get("USE" as Methode);
    if (_handlers) {
      handlers = [..._handlers, ...handlers];
    }
    route.set("GET", handlers);
    this.#router.set(path, route);
  }

  post(path: string, ...handlers: HandlerFunc[]): void {
    const route = this.#router.get(path) || new Map();
    const _handlers = this.#middleware.get(path)?.get("USE" as Methode);
    if (_handlers) {
      handlers = [..._handlers, ...handlers];
    }
    route.set("POST", handlers);
    this.#router.set(path, route);
  }

  put(path: string, ...handlers: HandlerFunc[]): void {
    const route = this.#router.get(path) || new Map();
    const _handlers = this.#middleware.get(path)?.get("USE" as Methode);
    if (_handlers) {
      handlers = [..._handlers, ...handlers];
    }
    route.set("PUT", handlers);
    this.#router.set(path, route);
  }

  delete(path: string, ...handlers: HandlerFunc[]): void {
    const route = this.#router.get(path) || new Map();
    const _handlers = this.#middleware.get(path)?.get("USE" as Methode);
    if (_handlers) {
      handlers = [..._handlers, ...handlers];
    }
    route.set("DELETE", handlers);
    this.#router.set(path, route);
  }
}
