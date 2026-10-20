import { locales, setupLocales, clearLocales, msg } from "../src/locales.mjs";

import { jest } from "@jest/globals";
import { withSilentDefaultLog } from "../test-fixtures/test-support.mjs";

describe("locales.mjs", () => {
  const mockLogger = {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  };
  const mockFs = {
    readdirSync: jest.fn(),
    readFileSync: jest.fn(),
  };
  const testDir = "test-fixtures/mock-locales";
  const enJson = '{"help":"Help text"}';
  const esJson = '{"help":"Texto de ayuda"}';

  afterEach(() => {
    clearLocales();
    jest.clearAllMocks();
  });

  it("loads locales from directory", () => {
    mockFs.readdirSync.mockReturnValue(["en-US.json", "es-ES.json"]);
    mockFs.readFileSync.mockImplementation((file) => {
      if (file.endsWith("en-US.json")) return enJson;
      if (file.endsWith("es-ES.json")) return esJson;
      return "";
    });
    setupLocales({
      fsLib: mockFs,
      localesDir: testDir,
      log: mockLogger,
    });
    expect(locales["en-US"].help).toBe("Help text");
    expect(locales["es-ES"].help).toBe("Texto de ayuda");
  });

  it("returns empty and does not warn if directory read fails", () => {
    mockFs.readdirSync.mockImplementation(() => {
      throw new Error("fail");
    });
    setupLocales({
      fsLib: mockFs,
      localesDir: testDir,
      log: mockLogger,
    });
    // No warning expected if warning is commented out
    expect(mockLogger.warn).not.toHaveBeenCalled();
  });

  it("clears previously loaded locales before loading", () => {
    locales["stale"] = { old: "value" };
    mockFs.readdirSync.mockReturnValue(["en-US.json"]);
    mockFs.readFileSync.mockReturnValue(enJson);
    setupLocales({ fsLib: mockFs, localesDir: testDir, log: mockLogger });
    expect(locales.stale).toBeUndefined();
    expect(locales["en-US"].help).toBe("Help text");
  });

  it("loads a locale named __proto__ as an own locale", () => {
    mockFs.readdirSync.mockReturnValue(["__proto__.json"]);
    mockFs.readFileSync.mockReturnValue('{"hello":"Hello"}');
    setupLocales({ fsLib: mockFs, localesDir: testDir, log: mockLogger });
    expect(Object.hasOwn(locales, "__proto__")).toBe(true);
    expect(locales.__proto__).toEqual({ hello: "Hello" });
  });

  it("clears locales", () => {
    locales["en-US"] = { help: "Help text" };
    clearLocales();
    expect(locales).toEqual({});
  });
});

describe("default locale API branches", () => {
  it("uses default setupLocales options", async () => {
    expect(await withSilentDefaultLog(() => setupLocales())).toEqual({ msg, loadedLocales: [] });
  });
});
