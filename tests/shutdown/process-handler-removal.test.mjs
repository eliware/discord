import { jest } from "@jest/globals";
import { removeProcessHandlers } from "../../src/shutdown/process-handler-removal.mjs";

it("removes registered process handlers", () => {
  const removeHandlers = jest.fn();
  removeProcessHandlers({ removeHandlers });
  expect(removeHandlers).toHaveBeenCalledTimes(1);
});

it("supports an absent process handler registration", () => {
  expect(removeProcessHandlers()).toBeUndefined();
});
