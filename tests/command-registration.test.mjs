import { log as sharedLog } from "@eliware/log";
import { jest } from "@jest/globals";
import { purgeCommands, registerCommands } from "../src/command-registration.mjs";

const log = { debug: jest.fn(), error: jest.fn(), info: jest.fn(), warn: jest.fn() };
const routes = {
  applicationCommands: jest.fn(() => "/commands"),
  applicationGuildCommands: jest.fn(() => "/guild-commands"),
};
const restClass = jest.fn(() => ({
  setToken: jest.fn().mockReturnThis(),
  put: jest.fn().mockResolvedValue({}),
}));

const withSilentDefaultLog = async (fn) => {
  const transports = sharedLog.transports ?? [];
  const prior = transports.map((transport) => transport.silent);
  transports.forEach((transport) => {
    transport.silent = true;
  });
  try {
    return await fn();
  } finally {
    transports.forEach((transport, index) => {
      transport.silent = prior[index];
    });
  }
};

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

  it("logs Discord and generic REST errors", async () => {
    for (const error of [
      { status: 401 },
      { status: 403 },
      { message: "oops" },
      new Error("plain"),
      null,
      {},
    ]) {
      const failedRest = jest.fn(() => ({
        setToken: jest.fn().mockReturnThis(),
        put: jest.fn().mockRejectedValue(error),
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
    }
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

describe("purgeCommands", () => {
  it("deletes global and guild commands", async () => {
    await purgeCommands({ clientId: "cid", token: "token", log, restClass, routes });
    expect(restClass.mock.results[0].value.put).toHaveBeenCalledWith("/commands", { body: [] });
    await purgeCommands({
      clientId: "cid",
      token: "token",
      guildId: "gid",
      log,
      restClass,
      routes,
    });
    expect(restClass.mock.results[1].value.put).toHaveBeenCalledWith("/guild-commands", {
      body: [],
    });
  });

  it("rejects missing credentials", async () => {
    await expect(purgeCommands({ clientId: undefined, token: undefined, log })).rejects.toThrow(
      "Missing credentials",
    );
  });

  it("uses environment credentials and the default logger", async () => {
    const oldId = process.env.DISCORD_CLIENT_ID;
    const oldToken = process.env.DISCORD_TOKEN;
    delete process.env.DISCORD_CLIENT_ID;
    delete process.env.DISCORD_TOKEN;
    try {
      await withSilentDefaultLog(async () => {
        await expect(purgeCommands()).rejects.toThrow("Missing credentials");
      });
    } finally {
      if (oldId === undefined) delete process.env.DISCORD_CLIENT_ID;
      else process.env.DISCORD_CLIENT_ID = oldId;
      if (oldToken === undefined) delete process.env.DISCORD_TOKEN;
      else process.env.DISCORD_TOKEN = oldToken;
    }
  });
});
