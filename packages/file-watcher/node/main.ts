import * as T from "@effect-ts/core/Effect";
import { pipe } from "@effect-ts/core/Function";
import { sum } from "@effect-ts/file-watcher";

pipe(
  sum(1, 2),
  T.tap((n) => T.succeedWith(() => console.log(n))),
  T.runPromise
);
