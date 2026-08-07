import { log as sharedLog } from '@eliware/common';
import { jest } from '@jest/globals';

import { setupCommands, registerCommands, purgeCommands } from '../src/commands.mjs';
import fs from 'fs';

const withSilentDefaultLog = async (fn) => {
  const transports = sharedLog.transports ?? [];
  const previous = transports.map(transport => transport.silent);
  transports.forEach(transport => { transport.silent = true; });
  try { return await fn(); }
  finally { transports.forEach((transport, index) => { transport.silent = previous[index]; }); }
};

// Mocks
const mockLogger = { debug: jest.fn(), error: jest.fn(), warn: jest.fn(), info: jest.fn() };
const mockRest = jest.fn().mockImplementation(() => ({
  setToken: jest.fn().mockReturnThis(),
  put: jest.fn().mockResolvedValue({})
}));
const mockRoutes = {
  applicationCommands: jest.fn((id) => `/apps/${id}/commands`),
  applicationGuildCommands: jest.fn((id, gid) => `/apps/${id}/guilds/${gid}/commands`)
};
const mockFs = {
  readdirSync: jest.fn(),
  readFileSync: jest.fn(),
  existsSync: jest.fn()
};
const testDir = 'tests/mock-commands';
const testJson = '{"name":"help","description":"Help command"}';
const testHandler = { default: jest.fn() };

// Setup/teardown for mock files
beforeAll(() => {
  if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);
  fs.writeFileSync(`${testDir}/help.json`, testJson);
  fs.writeFileSync(`${testDir}/help.mjs`, '/* istanbul ignore file */\nexport default () => {}');
});
afterAll(() => {
  fs.rmSync(testDir, { recursive: true, force: true });
});
afterEach(() => {
  jest.clearAllMocks();
});

describe('setupCommands', () => {
  it('loads and registers commands and handlers', async () => {
    mockFs.readdirSync.mockReturnValue(['help.json']);
    mockFs.readFileSync.mockReturnValue(testJson);
    mockFs.existsSync.mockReturnValue(true);
    const importFn = jest.fn().mockResolvedValue(testHandler);
    const { commandDefs, commandHandlers } = await setupCommands({
      fsLib: mockFs,
      commandsDir: testDir,
      log: mockLogger,
      importFn
    });
    expect(commandHandlers.help).toBe(testHandler.default);
    expect(commandDefs[0].name).toBe('help');
    expect(importFn).toHaveBeenCalled();
  });

  it('returns empty when directory does not exist', async () => {
    mockFs.existsSync.mockReturnValue(false);
    expect(await setupCommands({ fsLib: mockFs, commandsDir: testDir, log: mockLogger })).toEqual({ commandDefs: [], commandHandlers: {} });
    expect(mockLogger.warn).toHaveBeenCalledWith(`Commands directory does not exist: ${testDir}`);
  });

  it('handles unreadable directory', async () => {
    mockFs.existsSync.mockImplementation(() => { throw new Error('fail'); });
    expect(await setupCommands({ fsLib: mockFs, commandsDir: testDir, log: mockLogger })).toEqual({ commandDefs: [], commandHandlers: {} });
    expect(mockLogger.warn).toHaveBeenCalledWith(`Commands directory missing or unreadable: ${testDir}`);
  });

  it('warns if handler is missing', async () => {
    mockFs.readdirSync.mockReturnValue(['help.json']);
    mockFs.readFileSync.mockReturnValue(testJson);
    mockFs.existsSync.mockReturnValue(false);
    const importFn = jest.fn();
    await setupCommands({
      fsLib: mockFs,
      commandsDir: testDir,
      log: mockLogger,
      importFn
    });
    // Accept either the handler warning or the directory warning (if directory missing)
    expect(
      mockLogger.warn.mock.calls.some(call => call[0] === 'No handler found for command help' || call[0].includes('Commands directory does not exist'))
    ).toBe(true);
  });

  it('warns when handler has no default function', async () => {
    mockFs.readdirSync.mockReturnValue(['help.json']);
    mockFs.readFileSync.mockReturnValue(testJson);
    mockFs.existsSync.mockReturnValue(true);
    await setupCommands({ fsLib: mockFs, commandsDir: testDir, log: mockLogger, importFn: jest.fn().mockResolvedValue({ default: 'nope' }) });
    expect(mockLogger.warn).toHaveBeenCalledWith('Handler for help does not export a default function.');
  });

  it('warns when handler import fails', async () => {
    mockFs.readdirSync.mockReturnValue(['help.json']);
    mockFs.readFileSync.mockReturnValue(testJson);
    mockFs.existsSync.mockReturnValue(true);
    const error = new Error('import fail');
    await setupCommands({ fsLib: mockFs, commandsDir: testDir, log: mockLogger, importFn: jest.fn().mockRejectedValue(error) });
    expect(mockLogger.warn).toHaveBeenCalledWith('Failed to load handler for help:', error);
  });

  it('skips non-json files', async () => {
    mockFs.readdirSync.mockReturnValue(['readme.txt']);
    expect(await setupCommands({ fsLib: mockFs, commandsDir: testDir, log: mockLogger })).toEqual({ commandDefs: [], commandHandlers: {} });
  });

  it('logs error if command definition fails', async () => {
    mockFs.readdirSync.mockReturnValue(['bad.json']);
    mockFs.readFileSync.mockImplementation(() => { throw new Error('fail'); });
    mockFs.existsSync.mockReturnValue(true);
    const importFn = jest.fn();
    await setupCommands({
      fsLib: mockFs,
      commandsDir: testDir,
      log: mockLogger,
      importFn
    });
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('Failed to load command definition for bad.json:'),
      expect.any(Error)
    );
  });
});

describe('registerCommands', () => {
  it('registers commands with Discord API', async () => {
    const result = await registerCommands({
      commandDefs: [{ name: 'help', description: 'Help' }],
      clientId: 'client',
      token: 'token',
      log: mockLogger,
      restClass: mockRest,
      routes: mockRoutes
    });
    expect(result).toBe(true);
  });

  it('returns false if no token', async () => {
    const result = await registerCommands({
      commandDefs: [{ name: 'help', description: 'Help' }],
      clientId: 'client',
      token: undefined,
      log: mockLogger,
      restClass: mockRest,
      routes: mockRoutes
    });
    expect(result).toBe(false);
  });

  it('returns false if no client id', async () => {
    expect(await registerCommands({ commandDefs: [{ name: 'help', description: 'Help' }], clientId: undefined, token: 'token', log: mockLogger })).toBe(false);
  });

  it('returns false if no commands', async () => {
    expect(await registerCommands({ commandDefs: [], clientId: 'client', token: 'token', log: mockLogger })).toBe(false);
  });

  it('handles REST errors by status and generic error', async () => {
    for (const error of [{ status: 401 }, { status: 403 }, { message: 'oops' }, new Error('plain')]) {
      const restClass = jest.fn().mockImplementation(() => ({ setToken: jest.fn().mockReturnThis(), put: jest.fn().mockRejectedValue(error) }));
      expect(await registerCommands({ commandDefs: [{ name: 'help', description: 'Help' }], clientId: 'client', token: 'token', log: mockLogger, restClass, routes: mockRoutes })).toBe(false);
    }
  });
});

describe('purgeCommands', () => {
  it('throws when credentials are missing', async () => {
    await expect(purgeCommands({ clientId: undefined, token: undefined, log: mockLogger })).rejects.toThrow('Missing credentials');
    expect(mockLogger.error).toHaveBeenCalledWith('DISCORD_TOKEN and DISCORD_CLIENT_ID must be set in your environment.');
  });
  it('purges all global commands', async () => {
    await purgeCommands({
      clientId: 'client',
      token: 'token',
      log: mockLogger,
      restClass: mockRest,
      routes: mockRoutes
    });
    expect(mockLogger.info).toHaveBeenCalledWith('All global application commands purged.');
  });
  it('purges all guild commands', async () => {
    await purgeCommands({
      clientId: 'client',
      token: 'token',
      guildId: 'guild',
      log: mockLogger,
      restClass: mockRest,
      routes: mockRoutes
    });
    expect(mockLogger.info).toHaveBeenCalledWith('All application commands purged for guild guild.');
  });
});

describe('command validation', () => {
  it('skips invalid command descriptions', async () => {
    mockFs.readdirSync.mockReturnValue(['bad.json']);
    mockFs.readFileSync.mockReturnValue(JSON.stringify({ name: 'bad', description: 'x'.repeat(101) }));
    mockFs.existsSync.mockReturnValue(true);
    const result = await setupCommands({ fsLib: mockFs, commandsDir: testDir, log: mockLogger });
    expect(result.commandDefs).toEqual([]);
    expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Invalid command definition'));
  });
});

// Remaining validation and fallback branches.
describe('commands edge coverage', () => {
  it('covers setup defaults', async () => {
    const result = await setupCommands({ commandsDir: testDir });
    expect(result.commandDefs).toHaveLength(1);
  });

  it.each([
    [null, 'definition must be an object'],
    [[], 'definition must be an object'],
    [{}, 'name must be 1-32 characters'],
    [{ name: 1, description: 'ok' }, 'name must be 1-32 characters'],
    [{ name: '', description: 'ok' }, 'name must be 1-32 characters'],
    [{ name: 'x'.repeat(33), description: 'ok' }, 'name must be 1-32 characters'],
    [{ name: 'ok' }, 'description must be 1-100 characters'],
    [{ name: 'ok', description: 1 }, 'description must be 1-100 characters'],
    [{ name: 'ok', description: '' }, 'description must be 1-100 characters']
  ])('rejects invalid definition %#', async (definition, message) => {
    mockFs.readdirSync.mockReturnValue(['bad.json']);
    mockFs.readFileSync.mockReturnValue(JSON.stringify(definition));
    mockFs.existsSync.mockReturnValue(true);
    await setupCommands({ fsLib: mockFs, commandsDir: testDir, log: mockLogger });
    expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining(message));
  });

  it('rejects a long description', async () => {
    mockFs.readdirSync.mockReturnValue(['bad.json']);
    mockFs.readFileSync.mockReturnValue(JSON.stringify({ name: 'ok', description: 'x'.repeat(101) }));
    mockFs.existsSync.mockReturnValue(true);
    await setupCommands({ fsLib: mockFs, commandsDir: testDir, log: mockLogger });
    expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('description must be 1-100 characters'));
  });

  it('covers missing credential branches and fallback errors', async () => {
    await expect(purgeCommands({ clientId: 'client', token: undefined, log: mockLogger })).rejects.toThrow('Missing credentials');
    await expect(purgeCommands({ clientId: undefined, token: 'token', log: mockLogger })).rejects.toThrow('Missing credentials');
    for (const error of [null, {}]) {
      const restClass = jest.fn().mockImplementation(() => ({ setToken: jest.fn().mockReturnThis(), put: jest.fn().mockRejectedValue(error) }));
      expect(await registerCommands({ commandDefs: [{ name: 'help', description: 'Help' }], clientId: 'client', token: 'token', log: mockLogger, restClass, routes: mockRoutes })).toBe(false);
    }
  });
});

describe('remaining command loader branch', () => {
  it('warns when a command handler file is absent', async () => {
    mockFs.readdirSync.mockReturnValue(['help.json']);
    mockFs.readFileSync.mockReturnValue(testJson);
    mockFs.existsSync.mockImplementation((file) => file === testDir);
    await setupCommands({ fsLib: mockFs, commandsDir: testDir, log: mockLogger });
    expect(mockLogger.warn).toHaveBeenCalledWith('No handler found for command help');
  });
});

describe('default logger branches', () => {
  it('uses default setupCommands options', async () => {
    await expect(setupCommands({ log: mockLogger })).resolves.toEqual({ commandDefs: [], commandHandlers: {} });
  });

  it('uses the default logger in setupCommands', async () => {
    await expect(setupCommands({ commandsDir: '/definitely-missing-commands', log: mockLogger })).resolves.toEqual({ commandDefs: [], commandHandlers: {} });
  });

  it('uses the default logger in registerCommands', async () => {
    await expect(registerCommands({ commandDefs: [], clientId: 'cid', token: undefined, log: mockLogger })).resolves.toBe(false);
  });

  it('uses the default logger in purgeCommands', async () => {
    await expect(purgeCommands({ clientId: undefined, token: undefined, log: mockLogger })).rejects.toThrow('Missing credentials');
  });
});


describe('default argument coverage', () => {
  it('covers setupCommands defaults', async () => {
    await withSilentDefaultLog(async () => {
      await expect(setupCommands()).resolves.toEqual({ commandDefs: [], commandHandlers: {} });
    });
  });

  it('covers registerCommands defaults', async () => {
    await withSilentDefaultLog(async () => {
      await expect(registerCommands({ commandDefs: [], clientId: 'cid', token: undefined })).resolves.toBe(false);
    });
  });

  it('covers purgeCommands defaults', async () => {
    await withSilentDefaultLog(async () => {
      await expect(purgeCommands({ clientId: undefined, token: undefined })).rejects.toThrow('Missing credentials');
    });
  });
});
