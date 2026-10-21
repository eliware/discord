import { jest } from "@jest/globals";

const loadLocales = jest.fn(() => []);
const locales = {};
const clearLocales = jest.fn(() => Object.keys(locales).forEach((key) => delete locales[key]));
jest.unstable_mockModule("../../src/locale/loader.mjs", () => ({ loadLocales }));
jest.unstable_mockModule("../../src/locale/api.mjs", () => ({ clearLocales, locales }));
const { setupLocaleStore } = await import("../../src/locale/setup.mjs");

describe("setupLocaleStore", () => {
  afterEach(() => {
    loadLocales.mockReset().mockReturnValue([]);
    clearLocales.mockClear();
    Object.keys(locales).forEach((key) => delete locales[key]);
  });

  it("clears stale locales and stores loaded definitions", () => {
    locales.stale = { old: "value" };
    loadLocales.mockReturnValue([["en-US", { hello: "Hello" }]]);
    const msg = jest.fn();
    const log = { error: jest.fn() };

    const result = setupLocaleStore({ localesDir: "/locales", log, fsLib: {}, msg });

    expect(clearLocales).toHaveBeenCalledTimes(1);
    expect(loadLocales).toHaveBeenCalledWith({ localesDir: "/locales", log, fsLib: {} });
    expect(locales).toEqual({ "en-US": { hello: "Hello" } });
    expect(result).toEqual({ msg, loadedLocales: ["en-US"] });
  });

  it("uses defaults when no setup options are given", () => {
    expect(setupLocaleStore()).toEqual({ msg: undefined, loadedLocales: [] });
    expect(clearLocales).toHaveBeenCalledTimes(1);
    expect(loadLocales).toHaveBeenCalledWith({
      localesDir: expect.any(String),
      log: expect.any(Object),
      fsLib: undefined,
    });
  });
});
