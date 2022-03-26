import * as T from "@effect-ts/core/Effect";

export function sum(x: number, y: number) {
  return T.succeedWith(() => x + y);
}
