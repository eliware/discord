import { jest } from "@jest/globals";
import { path } from "@eliware/path";
import { log, setup } from "../test-fixtures/discord-setup.mjs";

jest.unstable_mockModule("discord.js", () => ({
  Client: jest.fn(),
  GatewayIntentBits: { Guilds: 1 },
  Partials: {},
}));
jest.unstable_mockModule("../src/command/registration.mjs", () => ({
  registerCommands: jest.fn(),
}));
const initialize = jest.fn(async () => () => {});
jest.unstable_mockModule("../src/initialize.mjs", () => ({ initializeDiscord: initialize }));

const { Client } = await import("discord.js");
const { createDiscord } = await import("../src/discord.mjs");

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
  Client.mockReset();
});

it("requires both client identifiers", async () => {
  const oldId = process.env.DISCORD_CLIENT_ID;
  const oldToken = process.env.DISCORD_TOKEN;
  delete process.env.DISCORD_CLIENT_ID;
  delete process.env.DISCORD_TOKEN;
  try {
    await expect(createDiscord()).rejects.toThrow("DISCORD_CLIENT_ID is not set");
    await expect(createDiscord({ clientId: "cid" })).rejects.toThrow("DISCORD_TOKEN is not set");
  } finally {
    if (oldId === undefined) delete process.env.DISCORD_CLIENT_ID;
    else process.env.DISCORD_CLIENT_ID = oldId;
    if (oldToken === undefined) delete process.env.DISCORD_TOKEN;
    else process.env.DISCORD_TOKEN = oldToken;
  }
});

it("sets up the client and logs in", async () => {
  const appRoot = "C:/consumer-app";
  jest.spyOn(process, "cwd").mockReturnValue(appRoot);
  const client = { login: jest.fn().mockResolvedValue("ok") };
  Client.mockImplementation(() => client);
  await createDiscord({
    ...setup,
    clientId: "cid",
    token: "token",
    log: { ...log, child: jest.fn(() => log) },
    intents: { Guilds: true },
    context: { appValue: true },
  });
  expect(Client.mock.calls[0][0].intents.length).toBe(1);
  expect(initialize).toHaveBeenCalledWith(
    expect.objectContaining({
      client,
      context: { appValue: true },
      eventsDir: path(appRoot, "events"),
      localesDir: path(appRoot, "locales"),
      commandsDir: path(appRoot, "commands"),
    }),
  );
  expect(client.login).toHaveBeenCalledWith("token");
});

it("returns null when Discord is disabled without checking credentials", async () => {
  const oldId = process.env.DISCORD_CLIENT_ID;
  const oldToken = process.env.DISCORD_TOKEN;
  delete process.env.DISCORD_CLIENT_ID;
  delete process.env.DISCORD_TOKEN;
  try {
    await expect(createDiscord({ enabled: false })).resolves.toBeNull();
    expect(Client).not.toHaveBeenCalled();
    expect(initialize).not.toHaveBeenCalled();
  } finally {
    if (oldId === undefined) delete process.env.DISCORD_CLIENT_ID;
    else process.env.DISCORD_CLIENT_ID = oldId;
    if (oldToken === undefined) delete process.env.DISCORD_TOKEN;
    else process.env.DISCORD_TOKEN = oldToken;
  }
});

it("leaves gateway intents off by default", async () => {
  const client = { login: jest.fn().mockResolvedValue("ok") };
  Client.mockImplementation(() => client);
  await createDiscord({ clientId: "cid", token: "token", ...setup });
  expect(Client.mock.calls[0][0].intents).toEqual([]);
});

it("rejects invalid context and intent options", async () => {
  const base = { clientId: "cid", token: "token", ...setup };
  await expect(createDiscord({ ...base, context: { client: "reserved" } })).rejects.toThrow(
    "reserved key",
  );
  await expect(createDiscord({ ...base, intents: { Unknown: true } })).rejects.toThrow(
    "Unknown intents key",
  );
});

it("cleans up the client after login fails", async () => {
  const destroy = jest.fn().mockResolvedValue(undefined);
  const cleanup = jest.fn();
  initialize.mockResolvedValueOnce(cleanup);
  const client = { login: jest.fn().mockRejectedValue(new Error("login failed")), destroy };
  Client.mockImplementation(() => client);
  await expect(createDiscord({ clientId: "cid", token: "token", ...setup })).rejects.toThrow(
    "Discord sign-in failed: login failed",
  );
  expect(cleanup).toHaveBeenCalledTimes(1);
  expect(destroy).toHaveBeenCalledTimes(1);
});

it("cleans up signal and process handlers", async () => {
  const processObj = { on: jest.fn(), once: jest.fn(), off: jest.fn(), exit: jest.fn() };
  const signalHook = jest.fn().mockResolvedValue(undefined);
  const client = { login: jest.fn().mockResolvedValue("ok"), destroy: jest.fn() };
  Client.mockImplementation(() => client);
  await createDiscord({
    clientId: "cid",
    token: "token",
    signals: true,
    signalOptions: { processObj, shutdownHook: signalHook },
    processHandlers: true,
    processHandlerOptions: { processObj },
    ...setup,
  });
  const listener = processObj.on.mock.calls.find(([event]) => event === "SIGTERM")?.[1];
  await listener();
  expect(signalHook).toHaveBeenCalledWith("SIGTERM");
  expect(processObj.off).toHaveBeenCalled();
  expect(client.destroy).toHaveBeenCalledTimes(1);
});

it("uses the child logger", async () => {
  const client = { login: jest.fn().mockResolvedValue("ok") };
  const child = { debug: jest.fn(), error: jest.fn(), info: jest.fn(), warn: jest.fn() };
  const parent = { ...setup.log, child: jest.fn(() => child) };
  Client.mockImplementation(() => client);
  await createDiscord({
    ...setup,
    clientId: "cid",
    token: "token",
    log: parent,
  });
  expect(parent.child).toHaveBeenCalledWith({ component: "discord", clientId: "cid" });
  expect(initialize).toHaveBeenCalledWith(expect.objectContaining({ log: child }));
});

it("accepts signals without a user hook", async () => {
  const processObj = { on: jest.fn(), once: jest.fn(), off: jest.fn(), exit: jest.fn() };
  const client = { login: jest.fn().mockResolvedValue("ok"), destroy: jest.fn() };
  Client.mockImplementation(() => client);
  await createDiscord({
    clientId: "cid",
    token: "token",
    log: setup.log,
    signals: true,
    signalOptions: { processObj },
    ...setup,
  });
  const listener = processObj.on.mock.calls.find(([event]) => event === "SIGTERM")?.[1];
  await listener();
  expect(client.destroy).toHaveBeenCalledTimes(1);
});

it("cleans up when app setup fails before event setup", async () => {
  const destroy = jest.fn().mockResolvedValue(undefined);
  Client.mockImplementation(() => ({ destroy }));
  initialize.mockRejectedValueOnce(new Error("app setup failed"));
  await expect(
    createDiscord({
      clientId: "cid",
      token: "token",
      ...setup,
    }),
  ).rejects.toThrow("app setup failed");
  expect(destroy).toHaveBeenCalledTimes(1);
});
