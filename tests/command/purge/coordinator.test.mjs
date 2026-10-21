import { jest } from "@jest/globals";

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
