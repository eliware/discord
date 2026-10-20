import { jest } from "@jest/globals";

const registerHandlers = jest.fn();
const registerSignals = jest.fn();
jest.unstable_mockModule("@eliware/errors", () => ({ registerHandlers }));
jest.unstable_mockModule("@eliware/signals", () => ({ registerSignals }));
const { registerOptionalHandlers } = await import("../src/handler-registration.mjs");

afterEach(() => jest.clearAllMocks());

it("does not register disabled handlers", () => {
  registerOptionalHandlers({ registrations: {} });
  expect(registerSignals).not.toHaveBeenCalled();
  expect(registerHandlers).not.toHaveBeenCalled();
});

it("registers enabled handlers and stores their cleanup handles", () => {
  const signalRegistration = { removeHandlers: jest.fn() };
  const processHandlerRegistration = { removeHandlers: jest.fn() };
  registerSignals.mockReturnValue(signalRegistration);
  registerHandlers.mockReturnValue(processHandlerRegistration);
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
  expect(registerSignals).toHaveBeenCalledWith(
    expect.objectContaining({ log, exit: false, shutdownHook: expect.any(Function) }),
  );
  expect(registerHandlers).toHaveBeenCalledWith({ exit: false, log });
});
