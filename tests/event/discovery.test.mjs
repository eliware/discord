import { jest } from "@jest/globals";
import { withSilentDefaultLog } from "../../test-fixtures/test-support.mjs";

const loadEventHandler = jest.fn();
jest.unstable_mockModule("../../src/event/handler-loader.mjs", () => ({ loadEventHandler }));
const { discoverEventHandlers } = await import("../../src/event/discovery.mjs");

describe("discoverEventHandlers", () => {
  const log = { error: jest.fn(), warn: jest.fn() };

  afterEach(() => jest.clearAllMocks());

  it("loads valid handlers from event files", async () => {
    const handler = jest.fn();
    loadEventHandler.mockResolvedValueOnce(handler);
    const onHandler = jest.fn();
    const discovered = await discoverEventHandlers({
      eventsDir: "/events",
      fsLib: { readdirSync: () => ["ready.mjs", "notes.txt"] },
      log,
      onHandler,
    });
    expect(discovered).toBe(true);
    expect(onHandler).toHaveBeenCalledWith("ready", handler);
    expect(loadEventHandler).toHaveBeenCalledTimes(1);
  });

  it("returns false when the event folder cannot be read", async () => {
    const discovered = await discoverEventHandlers({
      eventsDir: "/events",
      fsLib: {
        readdirSync: () => {
          throw new Error("read failed");
        },
      },
      log,
    });
    expect(discovered).toBe(false);
    expect(log.warn).toHaveBeenCalledWith("Events directory missing or unreadable: /events");
  });

  it("uses default dependencies when called without options", async () => {
    await withSilentDefaultLog(async () => {
      await expect(discoverEventHandlers()).resolves.toBe(false);
    });
  });

  it("skips files without a default handler", async () => {
    const onHandler = jest.fn();
    loadEventHandler.mockResolvedValueOnce(undefined);
    const discovered = await discoverEventHandlers({
      eventsDir: "/events",
      fsLib: { readdirSync: () => ["ready.mjs"] },
      log,
      onHandler,
    });
    expect(discovered).toBe(true);
    expect(onHandler).not.toHaveBeenCalled();
  });

  it("uses the default import function", async () => {
    loadEventHandler.mockImplementationOnce(async ({ importFn }) => {
      const imported = await importFn("data:text/javascript,export default 1");
      expect(imported.default).toBe(1);
      return undefined;
    });
    await discoverEventHandlers({
      eventsDir: "/events",
      fsLib: { readdirSync: () => ["ready.mjs"] },
      log,
      onHandler: jest.fn(),
    });
    expect(loadEventHandler.mock.calls.at(-1)[0].importFn).toEqual(expect.any(Function));
  });
});
