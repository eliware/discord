import { setupLocales, clearLocales, msg } from "../src/locales.mjs";

import { jest } from "@jest/globals";
import { withSilentDefaultLog } from "../test-fixtures/test-support.mjs";

describe("locales.mjs", () => {
  const mockLogger = {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  };
  const mockFs = { readdirSync: jest.fn() };

  afterEach(() => {
    clearLocales();
    jest.clearAllMocks();
  });

  it("returns empty and does not warn if directory read fails", () => {
    mockFs.readdirSync.mockImplementation(() => {
      throw new Error("fail");
    });
    setupLocales({
      fsLib: mockFs,
      log: mockLogger,
    });
    expect(mockLogger.warn).not.toHaveBeenCalled();
  });
});

describe("default locale API branches", () => {
  it("uses default setupLocales options", async () => {
    expect(await withSilentDefaultLog(() => setupLocales())).toEqual({ msg, loadedLocales: [] });
  });
});
