import { jest } from "@jest/globals";
import { registerCommands } from "../../src/command/registration.mjs";
import { withSilentDefaultLog } from "../../test-fixtures/test-support.mjs";

const log = { debug: jest.fn(), error: jest.fn(), info: jest.fn(), warn: jest.fn() };
const routes = {
  applicationCommands: jest.fn(() => "/commands"),
  applicationGuildCommands: jest.fn(() => "/guild-commands"),
};
const restClass = jest.fn(() => ({
  setToken: jest.fn().mockReturnThis(),
  put: jest.fn().mockResolvedValue({}),
}));

afterEach(() => jest.clearAllMocks());

describe("registerCommands", () => {
  it("sends command definitions to Discord", async () => {
    const commandDefs = [{ name: "help", description: "Help" }];
    await expect(
      registerCommands({ commandDefs, clientId: "cid", token: "token", log, restClass, routes }),
    ).resolves.toBe(true);
    expect(restClass.mock.results[0].value.put).toHaveBeenCalledWith("/commands", {
      body: commandDefs,
    });
  });

  it("returns false when credentials or definitions are absent", async () => {
    const commandDefs = [{ name: "help", description: "Help" }];
    await expect(
      registerCommands({ commandDefs, clientId: "cid", token: undefined, log }),
    ).resolves.toBe(false);
    await expect(
      registerCommands({ commandDefs, clientId: undefined, token: "token", log }),
    ).resolves.toBe(false);
    await expect(
      registerCommands({ commandDefs: [], clientId: "cid", token: "token", log }),
    ).resolves.toBe(false);
  });

  it("returns false when the REST request fails", async () => {
    const failedRest = jest.fn(() => ({
      setToken: jest.fn().mockReturnThis(),
      put: jest.fn().mockRejectedValue(new Error("network failed")),
    }));
    await expect(
      registerCommands({
        commandDefs: [{ name: "help", description: "Help" }],
        clientId: "cid",
        token: "token",
        log,
        restClass: failedRest,
        routes,
      }),
    ).resolves.toBe(false);
  });

  it("uses default credentials and logger", async () => {
    const oldId = process.env.DISCORD_CLIENT_ID;
    const oldToken = process.env.DISCORD_TOKEN;
    process.env.DISCORD_CLIENT_ID = "cid";
    process.env.DISCORD_TOKEN = "token";
    try {
      await withSilentDefaultLog(() => registerCommands({ commandDefs: [], restClass, routes }));
    } finally {
      if (oldId === undefined) delete process.env.DISCORD_CLIENT_ID;
      else process.env.DISCORD_CLIENT_ID = oldId;
      if (oldToken === undefined) delete process.env.DISCORD_TOKEN;
      else process.env.DISCORD_TOKEN = oldToken;
    }
  });
});
