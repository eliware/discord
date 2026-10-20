import { jest } from "@jest/globals";
import { reportRegistrationError } from "../../src/command/registration-error.mjs";

describe("reportRegistrationError", () => {
  it.each([
    [401, "Discord rejected the request (401). Check the token and client ID."],
    [403, "Discord denied access (403). Check the bot permissions."],
  ])("reports Discord status %s", (status, message) => {
    const log = { error: jest.fn() };
    reportRegistrationError(log, { status });
    expect(log.error).toHaveBeenCalledWith(`Discord did not accept the commands: ${message}`);
  });

  it.each([
    [new Error("network failed"), "network failed"],
    [{ message: "request failed" }, "request failed"],
    [{}, {}],
    [null, null],
  ])("reports a generic REST error", (error, details) => {
    const log = { error: jest.fn() };
    reportRegistrationError(log, error);
    expect(log.error).toHaveBeenCalledWith("Discord command request failed:", details);
  });
});
