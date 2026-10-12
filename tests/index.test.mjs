import { expect, it } from "@jest/globals";
import * as api from "../src/index.mjs";

it("exports the public package API", () => {
  expect(api.createDiscord).toEqual(expect.any(Function));
  expect(api.shutdownDiscord).toEqual(expect.any(Function));
  expect(api.purgeCommands).toEqual(expect.any(Function));
  expect(api.splitMsg).toEqual(expect.any(Function));
});
