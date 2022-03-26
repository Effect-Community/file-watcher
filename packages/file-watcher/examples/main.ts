import * as T from "@effect-ts/core/Effect";
import * as S from "@effect-ts/core/Effect/Experimental/Stream";
import { pipe } from "@effect-ts/core/Function";
import { watch } from "@effect-ts/file-watcher";
import * as FS from "@effect-ts/node/FileSystem";
import { runMain } from "@effect-ts/node/Runtime";

pipe(
  watch("./src"),
  S.tap((event) =>
    T.succeedWith(() => {
      console.log(event);
    })
  ),
  S.mapEffect((event) =>
    T.struct({
      event: T.succeed(event),
      contents: pipe(FS.readFile(event.path), T.chain((buffer) => T.succeedWith(() => buffer.toString("utf-8"))))
    })
  ),
  S.tap((event) =>
    T.succeedWith(() => {
      console.log(event);
    })
  ),
  S.runDrain,
  T.provideSomeLayer(FS.LiveFS),
  runMain
);
