import { log as sharedLog } from "@eliware/log";
import { locales, setupLocales, clearLocales, msg } from "../src/locales.mjs";

import { jest } from "@jest/globals";

const withSilentDefaultLog = async (fn) => {
  const transports = sharedLog.transports ?? [];
  const previous = transports.map((transport) => transport.silent);
  transports.forEach((transport) => {
    transport.silent = true;
  });
  try {
    return await fn();
  } finally {
    transports.forEach((transport, index) => {
      transport.silent = previous[index];
    });
  }
};

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

  it("logs error if locale is not a flat string map", () => {
    mockFs.readdirSync.mockReturnValue(["bad.json"]);
    mockFs.readFileSync.mockReturnValue(JSON.stringify({ nested: { value: "no" } }));
    setupLocales({ fsLib: mockFs, localesDir: testDir, log: mockLogger });
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining("Failed to load or parse locale file bad.json:"),
      expect.any(TypeError),
    );
  });

  it("logs error if file parse fails", () => {
    mockFs.readdirSync.mockReturnValue(["en-US.json"]);
    mockFs.readFileSync.mockImplementation(() => "{bad json");
    setupLocales({
      fsLib: mockFs,
      localesDir: testDir,
      log: mockLogger,
    });
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining("Failed to load or parse locale file en-US.json:"),
      expect.any(Error),
    );
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

  it("handles missing directories and failed file reads", () => {
    const fsWithExists = { ...mockFs, existsSync: jest.fn().mockReturnValue(false) };
    expect(
      setupLocales({ fsLib: fsWithExists, localesDir: testDir, log: mockLogger }).loadedLocales,
    ).toEqual([]);
    const fsWithReadFailure = {
      ...mockFs,
      readdirSync: jest.fn().mockReturnValue(["en-US.json", "notes.txt"]),
      existsSync: jest.fn().mockReturnValue(true),
      readFileSync: jest.fn(() => {
        throw new Error("read fail");
      }),
    };
    setupLocales({ fsLib: fsWithReadFailure, localesDir: testDir, log: mockLogger });
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining("Failed to load or parse locale file en-US.json:"),
      expect.any(Error),
    );
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
