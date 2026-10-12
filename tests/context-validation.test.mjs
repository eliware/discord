import { validateContext } from "../src/context-validation.mjs";

describe("validateContext", () => {
  it("rejects reserved fields and non-plain context", () => {
    expect(() => validateContext({ client: "bad" })).toThrow(
      "context cannot define reserved key: client",
    );
    expect(() => validateContext([])).toThrow("context must be a plain object.");
  });
});
