import { jest } from "@jest/globals";
import { cleanupShutdownLocales } from "../../src/shutdown/locale-cleanup.mjs";

describe("cleanupShutdownLocales", () => {
  it("runs the supplied locale cleanup", () => {
    const clearLocalesFn = jest.fn();
    cleanupShutdownLocales(clearLocalesFn);
    expect(clearLocalesFn).toHaveBeenCalledTimes(1);
  });
});
