import { createLocaleStore } from "../../src/locale/store.mjs";
import { replaceLocaleStore } from "../../src/locale/store-setup.mjs";

describe("replaceLocaleStore", () => {
  it("clears old definitions before it stores loaded definitions", () => {
    const { clearLocales, locales } = createLocaleStore();
    locales.stale = { old: "value" };

    replaceLocaleStore({
      locales,
      loaded: [["en-US", { hello: "Hello" }]],
      clearLocalesFn: clearLocales,
    });

    expect(locales).toEqual({ "en-US": { hello: "Hello" } });
  });
});
