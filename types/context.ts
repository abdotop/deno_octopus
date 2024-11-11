export interface Context {
  req: Request;
  ok: boolean;
  redirected: boolean;
  status: number;
  statusText: string;
  type: ResponseType;
  url: string;
  clone(): Response;
  next(): Promise<void>;
  send(body: BodyInit, status?: number): void;

  // Headers methods
  append(name: string, value: string): void;
  delete(name: string): void;
  get(name: string): string | null;
  has(name: string): boolean;
  set(name: string, value: string): void;
  getSetCookie(): string[];
}
