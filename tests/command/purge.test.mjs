import { jest } from "@jest/globals";
import { withSilentDefaultLog } from "../../test-fixtures/test-support.mjs";

const log = { error: jest.fn(), info: jest.fn() };
const Routes = {
  applicationCommands: jest.fn(() => "/commands"),
  applicationGuildCommands: jest.fn(() => "/guild-commands"),
};
const put = jest.fn().mockResolvedValue({});
const setToken = jest.fn().mockReturnThis();
const REST = jest.fn(() => ({ setToken, put }));
jest.unstable_mockModule("@discordjs/rest", () => ({ REST }));
jest.unstable_mockModule("discord.js", () => ({ Routes }));
const { purgeCommands } = await import("../../src/command/purge.mjs");

afterEach(() => jest.clearAllMocks());

describe("purgeCommands", () => {
  it("deletes global and guild commands", async () => {
    await purgeCommands({ clientId: "cid", token: "token", log });
    expect(put).toHaveBeenCalledWith("/commands", { body: [] });
    await purgeCommands({
      clientId: "cid",
      token: "token",
      guildId: "gid",
      log,
    });
    expect(put).toHaveBeenLastCalledWith("/guild-commands", { body: [] });
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
