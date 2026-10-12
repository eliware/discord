import { log as sharedLog } from "@eliware/log";
import { jest } from "@jest/globals";
import { purgeCommands } from "../src/command-purge.mjs";

const log = { error: jest.fn(), info: jest.fn() };
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

  it("uses default options and rejects when environment credentials are absent", async () => {
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
