export type HandlerFunc = (ctx: Context) => void;
export type Routes = Map<string, Map<string, HandlerFunc[]>>;
export type Config = Deno.ListenOptions;

export class ServerError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = "ServerError";
    this.statusCode = statusCode;
  }
}

export interface Context {
  req: Request;
  clone(): Response;
  next(): Promise<void>;
  send(body: BodyInit, status?: number): void;
  json(data: unknown, status?: number): void;

  to_socket(opts?: Deno.UpgradeWebSocketOptions): WebSocket;
  // Headers methods
  append(name: string, value: string): void;
  delete(name: string): void;
  get(name: string): string | null;
  has(name: string): boolean;
  set(name: string, value: string): void;
  getSetCookie(): string[];
}

export abstract class App {
  abstract run(cfg: Config): void;
  abstract close(): void;
  abstract use(path: string, ...handlers: HandlerFunc[]): void;
  abstract get(path: string, ...handlers: HandlerFunc[]): void;
  abstract post(path: string, ...handlers: HandlerFunc[]): void;
  abstract put(path: string, ...handlers: HandlerFunc[]): void;
  abstract delete(path: string, ...handlers: HandlerFunc[]): void;
}
