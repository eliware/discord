import { jest } from "@jest/globals";
import { withSilentDefaultLog } from "../../../test-fixtures/test-support.mjs";

const sendPurgeRequest = jest.fn();
jest.unstable_mockModule("../../../src/command/purge/request.mjs", () => ({ sendPurgeRequest }));
const { runPurgeCoordinator } = await import("../../../src/command/purge/coordinator.mjs");

afterEach(() => {
  jest.clearAllMocks();
});

it("sends a purge request when credentials are present", async () => {
  const log = { error: jest.fn() };
  sendPurgeRequest.mockResolvedValue(undefined);

  await runPurgeCoordinator({ clientId: "app-id", token: "token", guildId: "guild-id", log });

  expect(sendPurgeRequest).toHaveBeenCalledWith({
    clientId: "app-id",
    token: "token",
    guildId: "guild-id",
    log,
  });
});

it("logs and rejects when credentials are missing", async () => {
  const log = { error: jest.fn() };

  await expect(runPurgeCoordinator({ clientId: null, token: null, log })).rejects.toThrow(
    "Missing credentials",
  );
  expect(log.error).toHaveBeenCalledWith(
    "DISCORD_TOKEN and DISCORD_CLIENT_ID must be set in your environment.",
  );
  expect(sendPurgeRequest).not.toHaveBeenCalled();
});

it("uses default options and logger when called without arguments", async () => {
  const oldId = process.env.DISCORD_CLIENT_ID;
  const oldToken = process.env.DISCORD_TOKEN;
  delete process.env.DISCORD_CLIENT_ID;
  delete process.env.DISCORD_TOKEN;

  try {
    await withSilentDefaultLog(async () => {
      await expect(runPurgeCoordinator()).rejects.toThrow("Missing credentials");
    });
  } finally {
    if (oldId === undefined) delete process.env.DISCORD_CLIENT_ID;
    else process.env.DISCORD_CLIENT_ID = oldId;
    if (oldToken === undefined) delete process.env.DISCORD_TOKEN;
    else process.env.DISCORD_TOKEN = oldToken;
  }
  expect(sendPurgeRequest).not.toHaveBeenCalled();
});
