import * as C from "@effect-ts/core/Collections/Immutable/Chunk";
import * as T from "@effect-ts/core/Effect";
import * as S from "@effect-ts/core/Effect/Experimental/Stream";
import * as M from "@effect-ts/core/Effect/Managed";
import * as Q from "@effect-ts/core/Effect/Queue";
import { pipe } from "@effect-ts/core/Function";
import watcher from "@parcel/watcher";

export class FileWatcherSubscriptionError {
  readonly _tag = "FileWatcherSubscriptionError";
  constructor(readonly error: Error) {}
}

export function watch(directory: string): S.Stream<unknown, FileWatcherSubscriptionError, watcher.Event> {
  return S.unwrapManaged(
    M.gen(function*($) {
      const runtime = yield* $(T.runtime());

      const queue = yield* $(pipe(
        Q.makeUnbounded<T.IO<FileWatcherSubscriptionError, C.Chunk<watcher.Event>>>(),
        M.makeExit((queue) => Q.shutdown(queue))
      ));

      yield* $(
        pipe(
          T.promise(() =>
            watcher.subscribe(directory, (err, events) => {
              if (err) {
                runtime.runFiber(Q.offer_(queue, T.fail(new FileWatcherSubscriptionError(err))));
              } else {
                runtime.runFiber(Q.offer_(queue, T.succeed(C.from(events))));
              }
            })
          ),
          M.makeExit((subscription) => T.promise(() => subscription.unsubscribe()))
        )
      );

      return S.repeatEffectChunk(pipe(queue, Q.take, T.flatten));
    })
  );
}
