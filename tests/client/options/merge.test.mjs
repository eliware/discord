import { mergeClientOptions } from "../../../src/client/options/merge.mjs";

describe("mergeClientOptions", () => {
  it("keeps normalized options when no client options are supplied", () => {
    expect(mergeClientOptions({ intents: [], partials: [] })).toEqual({
      intents: [],
      partials: [],
    });
  });

  it("adds client options and lets them replace normalized values", () => {
    expect(
      mergeClientOptions({ intents: [1], partials: [2] }, { intents: [3], app: true }),
    ).toEqual({ intents: [3], partials: [2], app: true });
  });
});
