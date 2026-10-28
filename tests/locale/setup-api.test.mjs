import { jest } from "@jest/globals";

const setupLocaleStore = jest.fn();
jest.unstable_mockModule("../../src/locale/setup.mjs", () => ({ setupLocaleStore }));

const { setupLocales } = await import("../../src/locale/setup-api.mjs");
const { clearLocales, locales, msg } = await import("../../src/locale/api.mjs");

it("connects the shared locale API to locale setup", () => {
  const options = { localesDir: "/app/locales" };

  setupLocales(options);

  expect(setupLocaleStore).toHaveBeenCalledWith({
    ...options,
    clearLocalesFn: clearLocales,
    locales,
    msg,
  });
});

it("uses default options when none are provided", () => {
  setupLocaleStore.mockClear();

  setupLocales();

  expect(setupLocaleStore).toHaveBeenCalledWith({
    clearLocalesFn: clearLocales,
    locales,
    msg,
  });
});
