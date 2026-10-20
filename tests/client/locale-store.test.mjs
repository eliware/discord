import { jest } from "@jest/globals";
import { createClientLocaleStore } from "../../src/client/locale-store.mjs";
import { clearLocales, locales } from "../../src/locale/store.mjs";

describe("createClientLocaleStore", () => {
  afterEach(() => clearLocales());

  it("isolates locale data and cleanup for each client", () => {
    const first = createClientLocaleStore();
    const second = createClientLocaleStore();
    const log = { error: jest.fn(), warn: jest.fn() };

    first.setupLocales({
      localesDir: "/first",
      log,
      loadLocalesFn: () => [["en-US", { message: "First client" }]],
    });
    second.setupLocales({
      localesDir: "/second",
      log,
      loadLocalesFn: () => [["en-US", { message: "Second client" }]],
    });

    expect(first.msg("en-US", "message")).toBe("First client");
    expect(second.msg("en-US", "message")).toBe("Second client");
    expect(locales).toEqual({});

    first.clearLocales();
    expect(second.msg("en-US", "message")).toBe("Second client");
  });
});
