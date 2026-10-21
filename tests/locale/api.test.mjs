import { clearLocales, locales, msg, setupLocales } from "../../src/locales.mjs";
import { withSilentDefaultLog } from "../../test-fixtures/test-support.mjs";

describe("locale API", () => {
  afterEach(() => clearLocales());

  it("looks up messages from the shared locale store", () => {
    locales["en-US"] = { hello: "Hello" };
    expect(msg("en-US", "hello")).toBe("Hello");
  });

  it("uses default setupLocales options", async () => {
    await expect(withSilentDefaultLog(() => setupLocales())).resolves.toEqual({
      msg,
      loadedLocales: [],
    });
  });
});
