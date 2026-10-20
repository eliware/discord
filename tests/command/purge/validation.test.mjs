import { hasPurgeCredentials } from "../../../src/command/purge/validation.mjs";

describe("hasPurgeCredentials", () => {
  it("requires both a client ID and token", () => {
    expect(hasPurgeCredentials({ clientId: "client", token: "token" })).toBe(true);
    expect(hasPurgeCredentials({ clientId: "client" })).toBe(false);
    expect(hasPurgeCredentials({ token: "token" })).toBe(false);
  });
});
