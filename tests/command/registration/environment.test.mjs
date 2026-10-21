import { resolveRegistrationConfig } from "../../../src/command/registration/environment.mjs";

describe("resolveRegistrationConfig", () => {
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
