import { jest } from "@jest/globals";

const Routes = {
  applicationCommands: jest.fn(() => "/commands"),
  applicationGuildCommands: jest.fn(() => "/guild-commands"),
};
const put = jest.fn().mockResolvedValue({});
const setToken = jest.fn().mockReturnThis();
const REST = jest.fn(() => ({ setToken, put }));
jest.unstable_mockModule("@discordjs/rest", () => ({ REST }));
jest.unstable_mockModule("discord.js", () => ({ Routes }));
const { sendPurgeRequest } = await import("../../../src/command/purge/request.mjs");

afterEach(() => jest.clearAllMocks());

describe("sendPurgeRequest", () => {
  const log = { info: jest.fn() };

  it("sends a global purge request", async () => {
    await sendPurgeRequest({ clientId: "cid", token: "token", log });
    expect(put).toHaveBeenCalledWith("/commands", { body: [] });
    expect(log.info).toHaveBeenCalledWith("All global application commands purged.");
  });

  it("sends a guild purge request", async () => {
    await sendPurgeRequest({ clientId: "cid", token: "token", guildId: "gid", log });
    expect(put).toHaveBeenCalledWith("/guild-commands", { body: [] });
    expect(log.info).toHaveBeenCalledWith("All application commands purged for guild gid.");
  });
});
