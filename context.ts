import { type HandlerFunc, type Context, ServerError } from "./types/types.ts";

export class Ctx implements Context {
  req: Request;
  status: number;
  statusText: string;
  private handlers: HandlerFunc[] = [];
  private currentHandlerIndex: number = 0;
  private _headers: Headers;
  private _body: BodyInit | null = null;
  private _bodyUsed: boolean = false;
  private _socket_response: Response | null;

  constructor(req: Request, headers: Headers, handlers?: HandlerFunc[]) {
    this.req = req;
    this._headers = headers;
    this.status = 200;
    this.statusText = "OK";
    this._socket_response = null;
    if (handlers) {
      this.handlers = handlers;
    }
  }

  clone(): Response {
    const headers = new Headers(this._headers);
    const body = this._bodyUsed ? this._body : null;
    const init: ResponseInit = {
      status: this.status,
      statusText: this.statusText,
      headers: headers,
    };
    if (this._socket_response) {
      return this._socket_response;
    }
    return new Response(body, init);
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

  to_socket(opts?: Deno.UpgradeWebSocketOptions): WebSocket {
    if (this.req.headers.get("upgrade") !== "websocket") {
      throw new ServerError("Request is not a WebSocket upgrade", 400);
    }
    const { socket, response } = Deno.upgradeWebSocket(this.req, opts);
    this._socket_response = response;
    return socket;
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
