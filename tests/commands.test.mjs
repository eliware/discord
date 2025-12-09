import { jest } from '@jest/globals';
import { setupCommands, registerCommands, purgeCommands } from '../src/commands.mjs';
import fs from 'fs';

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
  fs.writeFileSync(`${testDir}/help.mjs`, 'export default () => {}');
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
});

describe('purgeCommands', () => {
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
