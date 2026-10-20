import { jest } from "@jest/globals";

const client = { login: jest.fn() };
const ClientClass = jest.fn(() => client);
jest.unstable_mockModule("discord.js", () => ({
  Client: ClientClass,
  GatewayIntentBits: {},
  Partials: { Message: 1, Channel: 2, Reaction: 3 },
}));
const { createDiscordClient } = await import("../../src/client/create.mjs");

it("constructs a Discord client with resolved options", () => {
  expect(
    createDiscordClient({
      intents: undefined,
      partials: undefined,
      clientOptions: { applicationId: "app-id" },
    }),
  ).toBe(client);
  expect(ClientClass).toHaveBeenCalledWith({
    intents: [],
    partials: expect.any(Array),
    applicationId: "app-id",
  });
});

it("uses the default client options when no arguments are given", () => {
  expect(createDiscordClient()).toBe(client);
  expect(ClientClass).toHaveBeenLastCalledWith({
    intents: [],
    partials: [1, 2, 3],
  });
});
