import { jest } from "@jest/globals";
import { cleanupShutdownHandlers } from "../../src/shutdown/handler-cleanup.mjs";

describe("cleanupShutdownHandlers", () => {
  it("removes signal and process handlers", () => {
    const removeSignals = jest.fn();
    const removeProcesses = jest.fn();
    cleanupShutdownHandlers({
      signalRegistration: { removeHandlers: removeSignals },
      processHandlerRegistration: { removeHandlers: removeProcesses },
    });
    expect(removeSignals).toHaveBeenCalledTimes(1);
    expect(removeProcesses).toHaveBeenCalledTimes(1);
  });
});
