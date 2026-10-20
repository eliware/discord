import { jest } from "@jest/globals";

const registerHandlers = jest.fn();
jest.unstable_mockModule("@eliware/errors", () => ({ registerHandlers }));
const { registerProcessHandlers } = await import("../../src/handler/process-registration.mjs");

it("registers process handlers with the app logger", () => {
  const registration = { removeHandlers: jest.fn() };
  registerHandlers.mockReturnValue(registration);
  const processHandlerOptions = { exit: false };
  const log = { error: jest.fn() };
  expect(registerProcessHandlers({ processHandlerOptions, log })).toBe(registration);
  expect(registerHandlers).toHaveBeenCalledWith({ ...processHandlerOptions, log });
});
