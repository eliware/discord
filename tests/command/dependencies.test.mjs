import { createCommandDependencies } from "../../src/command/dependencies.mjs";

describe("createCommandDependencies", () => {
  it("provides filesystem and import defaults", () => {
    const dependencies = createCommandDependencies();
    expect(dependencies.fsLib).toEqual({
      readdirSync: expect.any(Function),
      readFileSync: expect.any(Function),
      existsSync: expect.any(Function),
    });
    expect(dependencies.importFn).toEqual(expect.any(Function));
  });

  it("keeps supplied filesystem and import functions", () => {
    const fsLib = {};
    const importFn = () => {};
    expect(createCommandDependencies({ fsLib, importFn })).toEqual({ fsLib, importFn });
  });
});
