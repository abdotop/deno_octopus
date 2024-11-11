import type { Context } from "./context";

export type HandlerFunc = (
  ctx: Context,
) => Promise<Response | void> | Response | void;
export type Methode = "GET" | "POST" | "PUT" | "DELETE";
export type Routes = Map<string, Map<Methode, HandlerFunc[]>>;
export type Config = Deno.ListenOptions;
export type Error =
  | {
    code: number;
    message: string;
  }
  | unknown;
