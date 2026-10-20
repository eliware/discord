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

const { createDiscord } = await import("../src/discord.mjs");

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
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
  const ClientClass = jest.fn(() => client);
  const localeSetup = jest.fn(() => ({ msg: jest.fn(), loadedLocales: [] }));
  const commandSetup = jest.fn(async () => ({ commandDefs: [], commandHandlers: {} }));
  const eventSetup = jest.fn(async ({ client: target }) => ({
    loadedEvents: ["ready"],
    cleanup: jest.fn(() => (target.done = true)),
  }));
  await createDiscord({
    ...setup,
    clientId: "cid",
    token: "token",
    log: { ...log, child: jest.fn(() => log) },
    ClientClass,
    setupLocalesFn: localeSetup,
    setupCommandsFn: commandSetup,
    setupEventsFn: eventSetup,
    intents: { Guilds: true },
    context: { appValue: true },
  });
  expect(ClientClass.mock.calls[0][0].intents.length).toBe(1);
  expect(eventSetup).toHaveBeenCalledWith(
    expect.objectContaining({
      context: { appValue: true },
      eventsDir: path(appRoot, "events"),
    }),
  );
  expect(localeSetup).toHaveBeenCalledWith(
    expect.objectContaining({
      localesDir: path(appRoot, "locales"),
    }),
  );
  expect(commandSetup).toHaveBeenCalledWith(
    expect.objectContaining({
      commandsDir: path(appRoot, "commands"),
    }),
  );
  expect(client.login).toHaveBeenCalledWith("token");
});

it("leaves gateway intents off by default", async () => {
  const client = { login: jest.fn().mockResolvedValue("ok") };
  const ClientClass = jest.fn(() => client);
  await createDiscord({ clientId: "cid", token: "token", ClientClass, ...setup });
  expect(ClientClass.mock.calls[0][0].intents).toEqual([]);
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

it("wraps login errors and cleans up", async () => {
  const destroy = jest.fn().mockResolvedValue(undefined);
  const cleanup = jest.fn();
  const client = { login: jest.fn().mockRejectedValue(new Error("login failed")), destroy };
  await expect(
    createDiscord({
      clientId: "cid",
      token: "token",
      ClientClass: jest.fn(() => client),
      ...setup,
      setupEventsFn: async () => ({ loadedEvents: [], cleanup }),
    }),
  ).rejects.toThrow("Discord sign-in failed: login failed");
  expect(cleanup).toHaveBeenCalledTimes(1);
  expect(destroy).toHaveBeenCalledTimes(1);
});

it("cleans up signal and process handlers", async () => {
  const processObj = { on: jest.fn(), once: jest.fn(), off: jest.fn(), exit: jest.fn() };
  const signalHook = jest.fn().mockResolvedValue(undefined);
  const client = { login: jest.fn().mockResolvedValue("ok"), destroy: jest.fn() };
  await createDiscord({
    clientId: "cid",
    token: "token",
    ClientClass: jest.fn(() => client),
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
  await createDiscord({
    ...setup,
    clientId: "cid",
    token: "token",
    log: parent,
    ClientClass: jest.fn(() => client),
  });
  expect(parent.child).toHaveBeenCalledWith({ component: "discord", clientId: "cid" });
  expect(child.info).toHaveBeenCalled();
});

it("accepts signals without a user hook", async () => {
  const processObj = { on: jest.fn(), once: jest.fn(), off: jest.fn(), exit: jest.fn() };
  const client = { login: jest.fn().mockResolvedValue("ok"), destroy: jest.fn() };
  await createDiscord({
    clientId: "cid",
    token: "token",
    log: setup.log,
    ClientClass: jest.fn(() => client),
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
  await expect(
    createDiscord({
      clientId: "cid",
      token: "token",
      ClientClass: jest.fn(() => ({ destroy })),
      ...setup,
      setupLocalesFn: () => ({}),
    }),
  ).rejects.toThrow("setupLocalesFn must return");
  expect(destroy).toHaveBeenCalledTimes(1);
});
