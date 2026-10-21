import { resolveRegistrationConfig } from "../../../src/command/registration/environment.mjs";

describe("resolveRegistrationConfig", () => {
  it("uses process environment when called without arguments", () => {
    const oldId = process.env.DISCORD_CLIENT_ID;
    const oldToken = process.env.DISCORD_TOKEN;
    process.env.DISCORD_CLIENT_ID = "process-id";
    process.env.DISCORD_TOKEN = "process-token";
    try {
      expect(resolveRegistrationConfig()).toEqual({
        clientId: "process-id",
        token: "process-token",
      });
    } finally {
      if (oldId === undefined) delete process.env.DISCORD_CLIENT_ID;
      else process.env.DISCORD_CLIENT_ID = oldId;
      if (oldToken === undefined) delete process.env.DISCORD_TOKEN;
      else process.env.DISCORD_TOKEN = oldToken;
    }
  });

  it("uses environment credentials when options are undefined", () => {
    expect(
      resolveRegistrationConfig({}, { DISCORD_CLIENT_ID: "env-id", DISCORD_TOKEN: "env-token" }),
    ).toEqual({ clientId: "env-id", token: "env-token" });
  });

  it("uses explicit values instead of environment credentials", () => {
    expect(
      resolveRegistrationConfig(
        { clientId: "option-id", token: "option-token" },
        { DISCORD_CLIENT_ID: "env-id", DISCORD_TOKEN: "env-token" },
      ),
    ).toEqual({ clientId: "option-id", token: "option-token" });
  });

  it("keeps explicit null values", () => {
    expect(
      resolveRegistrationConfig(
        { clientId: null, token: null },
        { DISCORD_CLIENT_ID: "env-id", DISCORD_TOKEN: "env-token" },
      ),
    ).toEqual({ clientId: null, token: null });
  });
});
