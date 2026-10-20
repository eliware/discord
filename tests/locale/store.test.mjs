import { clearLocales, locales } from "../../src/locale/store.mjs";

describe("locale store", () => {
  afterEach(() => clearLocales());

  it("clears all stored locale maps", () => {
    locales["en-US"] = { hello: "Hello" };
    locales["es-ES"] = { hello: "Hola" };
    clearLocales();
    expect(locales).toEqual({});
  });
});
