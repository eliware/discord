import { jest } from "@jest/globals";

const defaultRoutes = {
  applicationCommands: jest.fn(() => "/default-commands"),
  applicationCommand: jest.fn(() => "/default-command"),
};
const defaultRest = jest.fn(() => ({ setToken: jest.fn().mockReturnThis() }));
jest.unstable_mockModule("@discordjs/rest", () => ({ REST: defaultRest }));
jest.unstable_mockModule("discord.js", () => ({ Routes: defaultRoutes }));
const { createCommandRequest } = await import("../../../src/command/registration/request.mjs");

it("constructs REST command requests with injected and default dependencies", async () => {
  const get = jest.fn().mockResolvedValue([]);
  const post = jest.fn().mockResolvedValue({});
  const patch = jest.fn().mockResolvedValue({});
  const setToken = jest.fn().mockReturnThis();
  const restClass = jest.fn(() => ({ setToken, get, post, patch }));
  const routes = {
    applicationCommands: jest.fn(() => "/commands"),
    applicationCommand: jest.fn(() => "/commands/command-id"),
  };
  const request = createCommandRequest({ clientId: "app-id", token: "token", restClass, routes });
  const definition = { name: "hello" };

  await request.getExistingCommands();
  await request.createCommand(definition);
  await request.updateCommand("command-id", definition);

  expect(restClass).toHaveBeenCalledWith({ version: "10" });
  expect(setToken).toHaveBeenCalledWith("token");
  expect(get).toHaveBeenCalledWith("/commands");
  expect(post).toHaveBeenCalledWith("/commands", { body: definition });
  expect(routes.applicationCommand).toHaveBeenCalledWith("app-id", "command-id");
  expect(patch).toHaveBeenCalledWith("/commands/command-id", { body: definition });

  createCommandRequest({ clientId: "app-id", token: "token" });

  expect(defaultRest).toHaveBeenCalledWith({ version: "10" });
  expect(defaultRoutes.applicationCommands).toHaveBeenCalledWith("app-id");
});
