import { jest } from "@jest/globals";

const registerSignals = jest.fn();
const createSignalCleanupHook = jest.fn(() => "cleanup-hook");
jest.unstable_mockModule("@eliware/signals", () => ({ registerSignals }));
jest.unstable_mockModule("../../src/signal-cleanup.mjs", () => ({ createSignalCleanupHook }));
const { registerSignalHandlers } = await import("../../src/handler/signal-registration.mjs");

it("registers signal handlers with a cleanup hook", () => {
  const registration = { removeHandlers: jest.fn() };
  registerSignals.mockReturnValue(registration);
  const cleanup = jest.fn();
  const userHook = jest.fn();
  const log = { info: jest.fn() };
  expect(registerSignalHandlers({ signalOptions: { shutdownHook: userHook }, log, cleanup })).toBe(
    registration,
  );
  expect(registerSignals).toHaveBeenCalledWith({
    shutdownHook: "cleanup-hook",
    log,
    exit: false,
  });
  expect(createSignalCleanupHook).toHaveBeenCalledWith(cleanup, userHook);
});
