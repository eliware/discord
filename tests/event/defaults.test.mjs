import { jest } from "@jest/globals";
import {
  createDefaultEventErrorHandler,
  createDefaultEventMessage,
} from "../../src/event/defaults.mjs";

describe("default event behavior", () => {
  it("returns the fallback message and logs the missing lookup", () => {
    const log = { warn: jest.fn() };
    const msg = createDefaultEventMessage(log);
    expect(msg("en-US", "missing")).toBe("An error occurred.");
    expect(msg("en-US", "missing", "fallback")).toBe("fallback");
    expect(log.warn).toHaveBeenCalledWith(
      "Localization function not provided. Returning default message for missing.",
    );
  });

  it("logs event handler errors", () => {
    const log = { error: jest.fn() };
    const error = new Error("handler failed");
    createDefaultEventErrorHandler(log)(error, "ready");
    expect(log.error).toHaveBeenCalledWith("Event handler failed for ready:", error);
  });
});
