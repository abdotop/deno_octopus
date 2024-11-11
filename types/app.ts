import type { Config, HandlerFunc } from "./types.ts";

export abstract class App {
  abstract run(cfg: Config): void;
  abstract close(): void;
  abstract use(path: string, ...handlers: HandlerFunc[]): void;
  abstract get(path: string, ...handlers: HandlerFunc[]): void;
  abstract post(path: string, ...handlers: HandlerFunc[]): void;
  abstract put(path: string, ...handlers: HandlerFunc[]): void;
  abstract delete(path: string, ...handlers: HandlerFunc[]): void;
}
