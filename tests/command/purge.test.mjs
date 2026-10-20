import { jest } from "@jest/globals";
import { withSilentDefaultLog } from "../../test-fixtures/test-support.mjs";

const sendPurgeRequest = jest.fn().mockResolvedValue(undefined);
jest.unstable_mockModule("../../src/command/purge/request.mjs", () => ({ sendPurgeRequest }));
const { purgeCommands } = await import("../../src/command/purge.mjs");

afterEach(() => jest.clearAllMocks());

describe("purgeCommands", () => {
  it("validates credentials and sends the purge request", async () => {
    const log = { error: jest.fn(), info: jest.fn() };
    await purgeCommands({ clientId: "cid", token: "token", guildId: "gid", log });
    expect(sendPurgeRequest).toHaveBeenCalledWith({
      clientId: "cid",
      token: "token",
      guildId: "gid",
      log,
    });
  });

  it("rejects missing credentials before sending a request", async () => {
    const log = { error: jest.fn() };
    await expect(purgeCommands({ clientId: null, token: null, log })).rejects.toThrow(
      "Missing credentials",
    );
    expect(log.error).toHaveBeenCalledWith(
      "DISCORD_TOKEN and DISCORD_CLIENT_ID must be set in your environment.",
    );
    expect(sendPurgeRequest).not.toHaveBeenCalled();
  });

  it("uses default options when credentials are absent", async () => {
    const oldId = process.env.DISCORD_CLIENT_ID;
    const oldToken = process.env.DISCORD_TOKEN;
    delete process.env.DISCORD_CLIENT_ID;
    delete process.env.DISCORD_TOKEN;
    try {
      await withSilentDefaultLog(async () => {
        await expect(purgeCommands()).rejects.toThrow("Missing credentials");
      });
      expect(sendPurgeRequest).not.toHaveBeenCalled();
    } finally {
      if (oldId === undefined) delete process.env.DISCORD_CLIENT_ID;
      else process.env.DISCORD_CLIENT_ID = oldId;
      if (oldToken === undefined) delete process.env.DISCORD_TOKEN;
      else process.env.DISCORD_TOKEN = oldToken;
    }
  });
});
