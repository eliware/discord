import { createDiscord } from '../index.mjs';
import { jest } from '@jest/globals';

describe('createDiscord', () => {
  let oldToken;
  let oldClientId;
  beforeAll(() => {
    oldToken = process.env.DISCORD_TOKEN;
    oldClientId = process.env.DISCORD_CLIENT_ID;
  });
  afterAll(() => {
    process.env.DISCORD_TOKEN = oldToken;
    process.env.DISCORD_CLIENT_ID = oldClientId;
  });

  it('throws if no token is provided', async () => {
    delete process.env.DISCORD_TOKEN;
    delete process.env.DISCORD_CLIENT_ID;
    await expect(createDiscord({ token: undefined, client_id: undefined })).rejects.toThrow(/DISCORD_CLIENT_ID is not set/);
  });

  it('creates client, sets up events, and logs in (no commands)', async () => {
    const login = jest.fn(() => Promise.resolve('logged-in'));
    const setupEventsFn = jest.fn(async (opts) => { opts.client._eventsSetup = true; return { loadedEvents: ['ready'] }; });
    const setupCommandsFn = jest.fn(async () => ({ commandDefs: [], commandHandlers: {} }));
    const registerCommandsFn = jest.fn(async () => true);
    const setupLocalesFn = jest.fn(() => ({ msg: jest.fn(), loadedLocales: ['en-US'] }));
    const ClientClass = jest.fn().mockImplementation(() => ({ login, _eventsSetup: false }));
    const logger = { error: jest.fn(), info: jest.fn(), warn: jest.fn(), debug: jest.fn() };
    const client = await createDiscord({
      token: 'abc',
      client_id: 'cid',
      log: logger,
      setupEventsFn,
      setupCommandsFn,
      registerCommandsFn,
      setupLocalesFn,
      ClientClass,
      intents: { Guilds: true, GuildMessages: true },
      partials: ['MESSAGE'],
      clientOptions: { foo: 'bar' }
    });
    expect(ClientClass).toHaveBeenCalled();
    expect(setupEventsFn).toHaveBeenCalled();
    expect(setupCommandsFn).toHaveBeenCalled();
    expect(registerCommandsFn).not.toHaveBeenCalled();
    expect(setupLocalesFn).toHaveBeenCalled();
    expect(login).toHaveBeenCalledWith('abc');
    expect(client._eventsSetup).toBe(true);
  });

  it('throws if registerCommandsFn fails when commands exist', async () => {
    const login = jest.fn(() => Promise.resolve('logged-in'));
    const setupEventsFn = jest.fn(async (opts) => { opts.client._eventsSetup = true; return { loadedEvents: ['ready'] }; });
    const setupCommandsFn = jest.fn(async () => ({ commandDefs: [{ name: 'foo' }], commandHandlers: { foo: jest.fn() } }));
    const registerCommandsFn = jest.fn(async () => false);
    const setupLocalesFn = jest.fn(() => ({ msg: jest.fn(), loadedLocales: ['en-US'] }));
    const ClientClass = jest.fn().mockImplementation(() => ({ login, _eventsSetup: false }));
    const logger = { error: jest.fn(), info: jest.fn(), warn: jest.fn(), debug: jest.fn() };
    await expect(createDiscord({
      token: 'abc',
      client_id: 'cid',
      log: logger,
      setupEventsFn,
      setupCommandsFn,
      registerCommandsFn,
      setupLocalesFn,
      ClientClass,
      intents: { Guilds: true, GuildMessages: true },
      partials: ['MESSAGE'],
      clientOptions: { foo: 'bar' }
    })).rejects.toThrow('Failed to register commands with Discord API. Please check your command definitions and token.');
    expect(registerCommandsFn).toHaveBeenCalled();
  });

  it('throws if login fails', async () => {
    const login = jest.fn(() => Promise.reject(new Error('fail')));
    const setupEventsFn = jest.fn(async (opts) => { opts.client._eventsSetup = true; return { loadedEvents: ['ready'] }; });
    const setupCommandsFn = jest.fn(async () => ({ commandDefs: [], commandHandlers: {} }));
    const registerCommandsFn = jest.fn(async () => true);
    const setupLocalesFn = jest.fn(() => ({ msg: jest.fn(), loadedLocales: ['en-US'] }));
    const ClientClass = jest.fn().mockImplementation(() => ({ login, _eventsSetup: false }));
    const logger = { error: jest.fn(), info: jest.fn(), warn: jest.fn(), debug: jest.fn() };
    await expect(createDiscord({
      token: 'abc',
      client_id: 'cid',
      log: logger,
      setupEventsFn,
      setupCommandsFn,
      registerCommandsFn,
      setupLocalesFn,
      ClientClass,
      intents: { Guilds: true, GuildMessages: true },
      partials: ['MESSAGE'],
      clientOptions: { foo: 'bar' }
    })).rejects.toThrow('Failed to log in to Discord: fail');
    expect(logger.error).not.toHaveBeenCalled(); // Error is thrown, not logged
  });
});

describe('splitMsg', () => {
  let splitMsg;
  beforeAll(async () => {
    ({ splitMsg } = await import('../index.mjs'));
  });

  it('returns an empty array for empty string', () => {
    expect(splitMsg('')).toEqual([]);
  });

  it('returns the original string in an array if under maxLength', () => {
    expect(splitMsg('hello', 10)).toEqual(['hello']);
  });

  it('splits at newlines if possible', () => {
    const msg = 'line1\nline2\nline3';
    expect(splitMsg(msg, 6)).toEqual(['line1', 'line2', 'line3']);
  });

  it('splits at periods if no newline is found', () => {
    const msg = 'abc.def.ghi';
    expect(splitMsg(msg, 5)).toEqual(['abc.', 'def.', 'ghi']);
  });

  it('splits at maxLength if no newline or period is found', () => {
    const msg = 'abcdefghij';
    expect(splitMsg(msg, 3)).toEqual(['abc', 'def', 'ghi', 'j']);
  });

  it('trims whitespace from each chunk', () => {
    const msg = '  abc  def  ';
    expect(splitMsg(msg, 3)).toEqual(['abc', 'def']);
  });
});
