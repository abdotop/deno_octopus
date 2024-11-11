import type { HandlerFunc } from "./types/types.ts";
import type { Context } from "./types/context.ts";

export class Ctx implements Context {
  req: Request;
  ok: boolean;
  redirected: boolean;
  status: number;
  statusText: string;
  type: ResponseType;
  url: string;
  private handlers: HandlerFunc[] = [];
  private currentHandlerIndex: number = 0;
  private _headers: Headers;
  private _body: BodyInit | null = null;
  private _bodyUsed: boolean = false;

  constructor(req: Request, headers: Headers, handlers?: HandlerFunc[]) {
    this.req = req;
    this._headers = headers;
    this.ok = true;
    this.redirected = false;
    this.status = 200;
    this.statusText = "OK";
    this.type = "basic";
    this.url = req.url;
    if (handlers) {
      this.handlers = handlers;
    }
  }

  get bodyUsed(): boolean {
    return this._bodyUsed;
  }

  clone(): Response {
    const headers = new Headers(this._headers);
    const body = this.bodyUsed ? this._body : null;
    const init: ResponseInit = {
      status: this.status,
      statusText: this.statusText,
      headers: headers,
    };
    const response = new Response(body, init);
    // Set additional properties on the response object
    Object.defineProperty(response, "ok", { value: this.ok });
    Object.defineProperty(response, "redirected", { value: this.redirected });
    Object.defineProperty(response, "type", { value: this.type });
    Object.defineProperty(response, "url", { value: this.url });
    return response;
  }

  async next(): Promise<void> {
    if (this.currentHandlerIndex < this.handlers.length) {
      const handler = this.handlers[this.currentHandlerIndex];
      this.currentHandlerIndex++;
      await handler(this);
    }
  }

  send(body: BodyInit, status: number = 200): void {
    this._body = body;
    this._bodyUsed = true;
    this.status = status;
  }

  json(data: unknown, status: number = 200): void {
    this._headers.set("Content-Type", "application/json");
    this.send(JSON.stringify(data), status);
  }

  // Headers methods
  append(name: string, value: string): void {
    this._headers.append(name, value);
  }
  delete(name: string): void {
    this._headers.delete(name);
  }
  get(name: string): string | null {

    return this.req.headers.get(name);
  }
  has(name: string): boolean {
    return this.req.headers.has(name);
  }
  set(name: string, value: string): void {
    this._headers.set(name, value);
  }
  getSetCookie(): string[] {
    return this._headers.getSetCookie();
  }
}
