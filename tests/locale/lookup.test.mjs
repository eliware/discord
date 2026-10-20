import { jest } from "@jest/globals";
import { createLocaleLookup } from "../../src/locale/lookup.mjs";

describe("createLocaleLookup", () => {
  const log = { error: jest.fn(), warn: jest.fn() };

  afterEach(() => jest.clearAllMocks());

  it("returns a message from the requested locale", () => {
    const msg = createLocaleLookup({ "en-US": { hello: "Hello" } });
    expect(msg("en-US", "hello", "fallback", log)).toBe("Hello");
  });

  it("uses the default locale when the requested locale is missing", () => {
    const msg = createLocaleLookup({ "en-US": { hello: "Hello" } });
    expect(msg("fr-FR", "hello", "fallback", log)).toBe("Hello");
    expect(log.warn).toHaveBeenCalledWith('Locale "fr-FR" does not exist. Use the default locale.');
  });

  it("returns fallback text when the default locale or key is missing", () => {
    const msg = createLocaleLookup({ "en-US": { hello: "Hello" } });
    expect(msg("en-US", "missing", "fallback", log)).toBe("fallback");
    expect(msg("fr-FR", "hello", "fallback", { ...log, warn: jest.fn() })).toBe("Hello");
    expect(createLocaleLookup({})("en-US", "hello", "fallback", log)).toBe("fallback");
    expect(log.warn).toHaveBeenCalledWith(
      'Key "missing" is missing from locale "en-US". Return the supplied text.',
    );
    expect(log.error).toHaveBeenCalledWith(
      'Default locale "en-US" does not exist. Return the supplied text.',
    );
  });

  it("treats inherited locale and message names as missing", () => {
    const msg = createLocaleLookup({ "en-US": { hello: "Hello" } });
    expect(msg("constructor", "hello", "fallback", log)).toBe("Hello");
    expect(msg("en-US", "constructor", "fallback", log)).toBe("fallback");
    expect(msg("en-US", "toString", "fallback", log)).toBe("fallback");
  });

  it("reads own locale names such as __proto__", () => {
    const locales = Object.create(null);
    locales.__proto__ = { hello: "Hello" };
    expect(createLocaleLookup(locales)("__proto__", "hello", "fallback", log)).toBe("Hello");
  });

  it("uses the default fallback text", () => {
    expect(createLocaleLookup({ "en-US": {} })("en-US", "missing", undefined, log)).toBe(
      "An important error occurred.",
    );
  });

  it("uses default arguments for a successful lookup", () => {
    expect(createLocaleLookup({ "en-US": { hello: "Hello" } })("en-US", "hello")).toBe("Hello");
  });
});
