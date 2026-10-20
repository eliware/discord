import { jest } from "@jest/globals";

const registerProcessHandlers = jest.fn();
const registerSignalHandlers = jest.fn();
jest.unstable_mockModule("../src/handler/process-registration.mjs", () => ({
  registerProcessHandlers,
}));
jest.unstable_mockModule("../src/handler/signal-registration.mjs", () => ({
  registerSignalHandlers,
}));
const { registerOptionalHandlers } = await import("../src/handler-registration.mjs");

afterEach(() => jest.clearAllMocks());

it("does not register disabled handlers", () => {
  registerOptionalHandlers({ registrations: {} });
  expect(registerSignalHandlers).not.toHaveBeenCalled();
  expect(registerProcessHandlers).not.toHaveBeenCalled();
});

it("registers enabled handlers and stores their cleanup handles", () => {
  const signalRegistration = { removeHandlers: jest.fn() };
  const processHandlerRegistration = { removeHandlers: jest.fn() };
  registerSignalHandlers.mockReturnValue(signalRegistration);
  registerProcessHandlers.mockReturnValue(processHandlerRegistration);
  const registrations = {};
  const cleanup = jest.fn();
  const userHook = jest.fn();
  const log = { info: jest.fn() };

  registerOptionalHandlers({
    signals: true,
    signalOptions: { shutdownHook: userHook },
    processHandlers: true,
    processHandlerOptions: { exit: false },
    log,
    cleanup,
    registrations,
  });

  expect(registrations).toEqual({ signalRegistration, processHandlerRegistration });
  expect(registerSignalHandlers).toHaveBeenCalledWith({
    signalOptions: { shutdownHook: userHook },
    log,
    cleanup,
  });
  expect(registerProcessHandlers).toHaveBeenCalledWith({
    processHandlerOptions: { exit: false },
    log,
  });
});
