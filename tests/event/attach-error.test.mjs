import { markEventListenerAttachError } from "../../src/event/attach-error.mjs";

describe("markEventListenerAttachError", () => {
  it("marks and returns the original error", () => {
    const error = new Error("attach failed");
    expect(markEventListenerAttachError(error)).toBe(error);
    expect(error.eventListenerAttach).toBe(true);
  });
});
