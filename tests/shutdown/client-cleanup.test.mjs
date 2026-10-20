import { jest } from "@jest/globals";
import { cleanupShutdownClient } from "../../src/shutdown/client-cleanup.mjs";

describe("cleanupShutdownClient", () => {
  it("removes registered handlers and destroys the client", async () => {
    const removeSignals = jest.fn();
    const removeProcesses = jest.fn();
    const destroy = jest.fn().mockResolvedValue(undefined);
    const client = { destroy };

    await cleanupShutdownClient(client, {
      signalRegistration: { removeHandlers: removeSignals },
      processHandlerRegistration: { removeHandlers: removeProcesses },
    });

    expect(removeSignals).toHaveBeenCalledTimes(1);
    expect(removeProcesses).toHaveBeenCalledTimes(1);
    expect(destroy).toHaveBeenCalledTimes(1);
  });
});
