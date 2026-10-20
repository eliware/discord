import { jest } from "@jest/globals";
import { discoverEventHandlers } from "../../src/event/discovery.mjs";
import { withSilentDefaultLog } from "../../test-fixtures/test-support.mjs";

describe("discoverEventHandlers", () => {
  const log = { error: jest.fn(), warn: jest.fn() };

  afterEach(() => jest.clearAllMocks());

  it("uses default options when no event folder is supplied", async () => {
    await expect(withSilentDefaultLog(() => discoverEventHandlers())).resolves.toBe(false);
  });

  it("loads valid handlers from event files", async () => {
    const handler = jest.fn();
    const importFn = jest.fn().mockResolvedValue({ default: handler });
    const onHandler = jest.fn();
    const discovered = await discoverEventHandlers({
      eventsDir: "/events",
      fsLib: { readdirSync: () => ["ready.mjs", "notes.txt"] },
      importFn,
      log,
      onHandler,
    });
    expect(discovered).toBe(true);
    expect(onHandler).toHaveBeenCalledWith("ready", handler);
    expect(importFn).toHaveBeenCalledTimes(1);
  });

  it("returns false when the event folder cannot be read", async () => {
    const discovered = await discoverEventHandlers({
      eventsDir: "/events",
      fsLib: {
        readdirSync: () => {
          throw new Error("read failed");
        },
      },
      importFn: jest.fn(),
      log,
    });
    expect(discovered).toBe(false);
    expect(log.warn).toHaveBeenCalledWith("Events directory missing or unreadable: /events");
  });

  it("skips files without a default handler", async () => {
    const onHandler = jest.fn();
    const discovered = await discoverEventHandlers({
      eventsDir: "/events",
      fsLib: { readdirSync: () => ["ready.mjs"] },
      importFn: jest.fn().mockResolvedValue({ default: "invalid" }),
      log,
      onHandler,
    });
    expect(discovered).toBe(true);
    expect(onHandler).not.toHaveBeenCalled();
    expect(log.warn).toHaveBeenCalledWith(
      "Event handler for ready does not export a default function.",
    );
  });
});
