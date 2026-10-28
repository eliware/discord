import { jest } from "@jest/globals";
import { clearLocales, locales, msg } from "../src/locale/api.mjs";
import { setupLocales } from "../src/locale/setup-api.mjs";

describe("locales.mjs", () => {
  afterEach(() => clearLocales());

  it("forwards app folder and file options to locale setup", () => {
    const localesDir = "/consumer/locales";
    const fsLib = {
      existsSync: jest.fn(() => true),
      readdirSync: jest.fn(() => ["en-US.json"]),
      readFileSync: jest.fn(() => '{"hello":"Hello"}'),
    };
    const result = setupLocales({ localesDir, fsLib });

    expect(fsLib.readdirSync).toHaveBeenCalledWith(localesDir);
    expect(fsLib.readFileSync).toHaveBeenCalledWith(expect.stringContaining("en-US.json"), "utf8");
    expect(result).toEqual({ msg, loadedLocales: ["en-US"] });
    expect(msg("en-US", "hello")).toBe("Hello");
    expect(locales).toEqual({ "en-US": { hello: "Hello" } });
  });
});
