import { jest } from "@jest/globals";
import { registerCommands } from "../../src/command/registration.mjs";
import { withSilentDefaultLog } from "../../test-fixtures/test-support.mjs";
import { withEnvironment } from "../../test-fixtures/environment.mjs";

const log = { debug: jest.fn(), error: jest.fn(), info: jest.fn(), warn: jest.fn() };
const routes = {
  applicationCommands: jest.fn(() => "/commands"),
  applicationCommand: jest.fn((clientId, commandId) => `/commands/${clientId}/${commandId}`),
  applicationGuildCommands: jest.fn(() => "/guild-commands"),
};
const get = jest.fn().mockResolvedValue([]);
const post = jest.fn().mockResolvedValue({});
const patch = jest.fn().mockResolvedValue({});
const restClass = jest.fn(() => ({
  setToken: jest.fn().mockReturnThis(),
  get,
  post,
  patch,
}));

afterEach(() => jest.clearAllMocks());

describe("registerCommands", () => {
  it("creates new command definitions without replacing the global command list", async () => {
    const commandDefs = [{ name: "help", description: "Help" }];
    await expect(
      registerCommands({ commandDefs, clientId: "cid", token: "token", log, restClass, routes }),
    ).resolves.toBe(true);
    expect(get).toHaveBeenCalledWith("/commands");
    expect(post).toHaveBeenCalledWith("/commands", {
      body: commandDefs[0],
    });
    expect(patch).not.toHaveBeenCalled();
  });

  it("updates app commands and preserves unrelated or skipped commands", async () => {
    const existingCommands = [
      { id: "managed-id", name: "managed", description: "Old definition" },
      { id: "unrelated-id", name: "unrelated", description: "Other app" },
      { id: "skipped-id", name: "skipped", description: "Missing local handler" },
    ];
    get.mockResolvedValueOnce(existingCommands);
    const commandDefs = [
      { name: "managed", description: "Updated definition" },
      { name: "new", description: "New definition" },
    ];

    await expect(
      registerCommands({ commandDefs, clientId: "cid", token: "token", log, restClass, routes }),
    ).resolves.toBe(true);

    expect(patch).toHaveBeenCalledWith("/commands/cid/managed-id", { body: commandDefs[0] });
    expect(post).toHaveBeenCalledWith("/commands", { body: commandDefs[1] });
    expect(patch).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledTimes(1);
  });

  it("creates a command when its name exists with a different type", async () => {
    get.mockResolvedValueOnce([{ id: "user-id", name: "help", type: 2 }]);
    const commandDefs = [{ name: "help", description: "Help" }];

    await expect(
      registerCommands({ commandDefs, clientId: "cid", token: "token", log, restClass, routes }),
    ).resolves.toBe(true);

    expect(post).toHaveBeenCalledWith("/commands", { body: commandDefs[0] });
    expect(patch).not.toHaveBeenCalled();
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
      get: jest.fn().mockRejectedValue(new Error("network failed")),
      post: jest.fn(),
      patch: jest.fn(),
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
    await withEnvironment({ DISCORD_CLIENT_ID: "cid", DISCORD_TOKEN: "token" }, async () => {
      await withSilentDefaultLog(() => registerCommands({ commandDefs: [], restClass, routes }));
    });
  });

  it("returns false when called without options or environment credentials", async () => {
    await withEnvironment({ DISCORD_CLIENT_ID: undefined, DISCORD_TOKEN: undefined }, async () => {
      await withSilentDefaultLog(async () => {
        await expect(registerCommands()).resolves.toBe(false);
      });
    });
  });
});
