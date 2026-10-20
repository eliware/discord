import { jest } from "@jest/globals";
import { loadEventHandler } from "../../src/event/handler-loader.mjs";

describe("loadEventHandler", () => {
  const log = { error: jest.fn(), warn: jest.fn() };

  afterEach(() => jest.clearAllMocks());

  it("returns a valid default handler", async () => {
    const handler = jest.fn();
    const importFn = jest.fn().mockResolvedValue({ default: handler });
    await expect(
      loadEventHandler({ eventName: "ready", eventsDir: "/events", importFn, log }),
    ).resolves.toBe(handler);
    expect(importFn).toHaveBeenCalledWith(expect.stringContaining("ready.mjs"));
  });

  it("warns when a module has no default function", async () => {
    const handler = await loadEventHandler({
      eventName: "ready",
      eventsDir: "/events",
      importFn: jest.fn().mockResolvedValue({ default: "invalid" }),
      log,
    });
    expect(handler).toBeUndefined();
    expect(log.warn).toHaveBeenCalledWith(
      "Event handler for ready does not export a default function.",
    );
  });

  it("logs import failures and returns no handler", async () => {
    const error = new Error("import failed");
    const handler = await loadEventHandler({
      eventName: "ready",
      eventsDir: "/events",
      importFn: jest.fn().mockRejectedValue(error),
      log,
    });
    expect(handler).toBeUndefined();
    expect(log.error).toHaveBeenCalledWith("Failed to load event ready:", error);
  });
});
