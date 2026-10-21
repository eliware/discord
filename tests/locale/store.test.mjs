import { createLocaleStore } from "../../src/locale/store.mjs";

const { clearLocales, locales } = createLocaleStore();

describe("locale store", () => {
  afterEach(() => clearLocales());

  it("clears all stored locale maps", () => {
    locales["en-US"] = { hello: "Hello" };
    locales["es-ES"] = { hello: "Hola" };
    clearLocales();
    expect(locales).toEqual({});
  });

  it("stores a locale named __proto__ as an own property", () => {
    Object.defineProperty(locales, "__proto__", {
      configurable: true,
      enumerable: true,
      value: { hello: "Hello" },
      writable: true,
    });
    expect(Object.hasOwn(locales, "__proto__")).toBe(true);
    expect(locales.__proto__).toEqual({ hello: "Hello" });
  });
});
