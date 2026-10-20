import { jest } from "@jest/globals";
import { shutdownDiscord } from "../src/shutdown.mjs";

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

it("cleans partial process setup after registration fails", async () => {
  const signalRegistration = { removeHandlers: jest.fn() };
  const processHandlerRegistration = { removeHandlers: jest.fn() };
  const error = Object.assign(new Error("process setup failed"), {
    registration: processHandlerRegistration,
  });
  registerSignalHandlers.mockReturnValue(signalRegistration);
  registerProcessHandlers.mockImplementationOnce(() => {
    throw error;
  });
  const registrations = {};

  expect(() =>
    registerOptionalHandlers({
      signals: true,
      processHandlers: true,
      log: { info: jest.fn() },
      cleanup: jest.fn(),
      registrations,
    }),
  ).toThrow(error);

  expect(registrations).toEqual({ signalRegistration, processHandlerRegistration });
  const destroy = jest.fn();
  await shutdownDiscord({ destroy }, registrations);
  expect(signalRegistration.removeHandlers).toHaveBeenCalledTimes(1);
  expect(processHandlerRegistration.removeHandlers).toHaveBeenCalledTimes(1);
  expect(destroy).toHaveBeenCalledTimes(1);
});

it("does not keep an unusable process cleanup value", () => {
  const error = Object.assign(new Error("process setup failed"), { registration: {} });
  registerProcessHandlers.mockImplementationOnce(() => {
    throw error;
  });
  const registrations = {};

  expect(() =>
    registerOptionalHandlers({
      processHandlers: true,
      log: { info: jest.fn() },
      registrations,
    }),
  ).toThrow(error);

  expect(registrations.processHandlerRegistration).toBeUndefined();
});
