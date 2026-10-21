import { jest } from "@jest/globals";
import { readLocaleDirectory } from "../../src/locale/directory-reader.mjs";
import { replaceLocaleStore } from "../../src/locale/store-setup.mjs";

const discoverFiles = jest.fn(() => []);
const readFiles = jest.fn(() => []);
const loadDefinitions = jest.fn(() => []);
const setupStore = jest.fn(replaceLocaleStore);
jest.unstable_mockModule("../../src/locale/discovery.mjs", () => ({
  discoverLocaleFiles: discoverFiles,
}));
jest.unstable_mockModule("../../src/locale/file-reader.mjs", () => ({
  readLocaleFiles: readFiles,
}));
jest.unstable_mockModule("../../src/locale/definition-loader.mjs", () => ({
  loadLocaleDefinitions: loadDefinitions,
}));
const { clearLocales, locales } = await import("../../src/locale/api.mjs");
const { setupLocaleStore } = await import("../../src/locale/setup.mjs");

describe("setupLocaleStore", () => {
  afterEach(() => {
    discoverFiles.mockReset().mockReturnValue([]);
    readFiles.mockReset().mockReturnValue([]);
    loadDefinitions.mockReset().mockReturnValue([]);
    setupStore.mockReset().mockImplementation(replaceLocaleStore);
    clearLocales();
  });

  it("clears stale locales and stores loaded definitions", () => {
    locales.stale = { old: "value" };
    discoverFiles.mockReturnValue(["en-US.json"]);
    readFiles.mockReturnValue([{ file: "en-US.json", content: '{"hello":"Hello"}' }]);
    loadDefinitions.mockReturnValue([["en-US", { hello: "Hello" }]]);
    const msg = jest.fn();
    const log = { error: jest.fn() };

    const result = setupLocaleStore({
      localesDir: "/locales",
      log,
      fsLib: {},
      msg,
      locales,
      clearLocalesFn: clearLocales,
      setupStore,
    });

    expect(locales).not.toHaveProperty("stale");
    expect(discoverFiles).toHaveBeenCalledWith({ localesDir: "/locales", fsLib: {} });
    expect(readFiles).toHaveBeenCalledWith({
      files: ["en-US.json"],
      localesDir: "/locales",
      fsLib: {},
      log,
    });
    expect(loadDefinitions).toHaveBeenCalledWith({
      files: [{ file: "en-US.json", content: '{"hello":"Hello"}' }],
      log,
    });
    expect(setupStore).toHaveBeenCalledWith({
      locales,
      loaded: [["en-US", { hello: "Hello" }]],
      clearLocalesFn: clearLocales,
    });
    expect(locales).toEqual({ "en-US": { hello: "Hello" } });
    expect(result).toEqual({ msg, loadedLocales: ["en-US"] });
  });

  it("loads defaults into the shared locale store", () => {
    expect(setupLocaleStore({ locales, clearLocalesFn: clearLocales, setupStore })).toEqual({
      msg: undefined,
      loadedLocales: [],
    });
    expect(discoverFiles).toHaveBeenCalledWith({
      localesDir: expect.any(String),
      fsLib: undefined,
    });
    expect(readFiles).toHaveBeenCalledWith({
      files: [],
      localesDir: expect.any(String),
      fsLib: undefined,
      log: expect.any(Object),
    });
    expect(loadDefinitions).toHaveBeenCalledWith({ files: [], log: expect.any(Object) });
    expect(setupStore).toHaveBeenCalledWith({ locales, loaded: [], clearLocalesFn: clearLocales });
    expect(locales).toEqual({});
  });

  it("returns no locales when directory reading fails", () => {
    const log = { warn: jest.fn(), error: jest.fn() };
    const fsLib = {
      readdirSync: jest.fn(() => {
        throw new Error("read failed");
      }),
    };
    const result = setupLocaleStore({
      localesDir: "/locales",
      fsLib,
      log,
      locales,
      clearLocalesFn: clearLocales,
      discoverFiles: ({ localesDir, fsLib }) => readLocaleDirectory({ localesDir, fsLib }),
    });

    expect(result.loadedLocales).toEqual([]);
    expect(log.warn).not.toHaveBeenCalled();
  });
});
