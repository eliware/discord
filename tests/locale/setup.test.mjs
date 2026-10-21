import { jest } from "@jest/globals";

const loadLocales = jest.fn(() => []);
jest.unstable_mockModule("../../src/locale/loader.mjs", () => ({ loadLocales }));
const { clearLocales, locales } = await import("../../src/locale/api.mjs");
const { setupLocaleStore } = await import("../../src/locale/setup.mjs");

describe("setupLocaleStore", () => {
  afterEach(() => {
    loadLocales.mockReset().mockReturnValue([]);
    clearLocales();
  });

  it("clears stale locales and stores loaded definitions", () => {
    locales.stale = { old: "value" };
    loadLocales.mockReturnValue([["en-US", { hello: "Hello" }]]);
    const msg = jest.fn();
    const log = { error: jest.fn() };

    const result = setupLocaleStore({
      localesDir: "/locales",
      log,
      fsLib: {},
      msg,
      locales,
      clearLocalesFn: clearLocales,
    });

    expect(locales).not.toHaveProperty("stale");
    expect(loadLocales).toHaveBeenCalledWith({ localesDir: "/locales", log, fsLib: {} });
    expect(locales).toEqual({ "en-US": { hello: "Hello" } });
    expect(result).toEqual({ msg, loadedLocales: ["en-US"] });
  });

  it("loads defaults into the shared locale store", () => {
    expect(setupLocaleStore({ locales, clearLocalesFn: clearLocales })).toEqual({
      msg: undefined,
      loadedLocales: [],
    });
    expect(loadLocales).toHaveBeenCalledWith({
      localesDir: expect.any(String),
      log: expect.any(Object),
      fsLib: undefined,
    });
    expect(locales).toEqual({});
  });
});
