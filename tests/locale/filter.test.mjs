import { filterLocaleFiles } from "../../src/locale/filter.mjs";

describe("filterLocaleFiles", () => {
  it("keeps JSON file names", () => {
    expect(filterLocaleFiles(["en-US.json", "readme.txt"])).toEqual(["en-US.json"]);
  });
});
