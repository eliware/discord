import { resolveLocaleFallback } from "../../src/locale/fallback.mjs";

describe("resolveLocaleFallback", () => {
  it("keeps an available locale", () => {
    expect(resolveLocaleFallback({ "fr-FR": {} }, "fr-FR")).toEqual({
      locale: "fr-FR",
      usedFallback: false,
    });
  });

  it("selects the default locale when the requested locale is missing", () => {
    expect(resolveLocaleFallback({ "en-US": {} }, "fr-FR")).toEqual({
      locale: "en-US",
      usedFallback: true,
    });
  });

  it("selects the default locale when the requested locale has no map", () => {
    expect(resolveLocaleFallback({ "fr-FR": null, "en-US": {} }, "fr-FR")).toEqual({
      locale: "en-US",
      usedFallback: true,
    });
  });
});
