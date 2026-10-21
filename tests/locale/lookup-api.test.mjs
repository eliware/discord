import { jest } from "@jest/globals";
import { msg } from "../../src/locale/lookup-api.mjs";

it("returns the supplied text when the requested locale is missing", () => {
  const log = { warn: jest.fn(), error: jest.fn() };

  expect(msg("fr", "hello", "fallback", log)).toBe("fallback");
  expect(log.warn).toHaveBeenCalledWith('Locale "fr" does not exist. Use the default locale.');
  expect(log.error).toHaveBeenCalledWith(
    'Default locale "en-US" does not exist. Return the supplied text.',
  );
});
