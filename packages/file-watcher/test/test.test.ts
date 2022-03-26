import * as T from "@effect-ts/core/Effect";
import { pipe } from "@effect-ts/core/Function";
import { sum } from "@effect-ts/file-watcher";
import { assert, describe, it } from "vitest";

describe("testing", () => {
  it("should do the thing", async () => {
    const program = sum(2, 2);

    const result = await pipe(program, T.runPromise);

    assert.equal(result, 4);
  });
});
