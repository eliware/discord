import { jest } from "@jest/globals";
import { removeSignalHandlers } from "../../src/shutdown/signal-handler-removal.mjs";

it("removes registered signal handlers", () => {
  const removeHandlers = jest.fn();
  removeSignalHandlers({ removeHandlers });
  expect(removeHandlers).toHaveBeenCalledTimes(1);
});

it("supports an absent signal registration", () => {
  expect(removeSignalHandlers()).toBeUndefined();
});
