import { jest } from "@jest/globals";

const runPurgeCoordinator = jest.fn();
jest.unstable_mockModule("../../src/command/purge/coordinator.mjs", () => ({
  runPurgeCoordinator,
}));
const { purgeCommands } = await import("../../src/command/purge.mjs");

afterEach(() => jest.clearAllMocks());

it("passes the public options to the purge coordinator", async () => {
  const options = { clientId: "app-id", token: "token" };
  runPurgeCoordinator.mockResolvedValue(undefined);

  await expect(purgeCommands(options)).resolves.toBeUndefined();

  expect(runPurgeCoordinator).toHaveBeenCalledWith(options);
});
