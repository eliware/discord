import { jest } from "@jest/globals";
import { reportLocaleFileFailure } from "../../src/locale/failure-reporting.mjs";

it("reports the locale file and the original error", () => {
  const error = new Error("read failed");
  const log = { error: jest.fn() };

  reportLocaleFileFailure({ file: "en-US.json", error, log });

  expect(log.error).toHaveBeenCalledWith("Failed to load or parse locale file en-US.json:", error);
});
