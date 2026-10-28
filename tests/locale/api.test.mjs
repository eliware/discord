import { clearLocales, locales, msg } from "../../src/locales.mjs";

describe("locale API", () => {
  afterEach(() => clearLocales());

  it("looks up messages from the shared locale store", () => {
    locales["en-US"] = { hello: "Hello" };
    expect(msg("en-US", "hello")).toBe("Hello");
  });
});
