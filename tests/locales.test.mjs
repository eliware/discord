import { log as sharedLog } from '@eliware/common';
import { locales, setupLocales, clearLocales, msg } from '../src/locales.mjs';

const defaultMockLogger = { error: jest.fn(), warn: jest.fn(), info: jest.fn() };
import fs from 'fs';
import path from 'path';
import { jest } from '@jest/globals';

const withSilentDefaultLog = async (fn) => {
  const transports = sharedLog.transports ?? [];
  const previous = transports.map(transport => transport.silent);
  transports.forEach(transport => { transport.silent = true; });
  try { return await fn(); }
  finally { transports.forEach((transport, index) => { transport.silent = previous[index]; }); }
};



describe('locales.mjs', () => {
  const mockLogger = {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn()
  };
  const mockFs = {
    readdirSync: jest.fn(),
    readFileSync: jest.fn()
  };
  const testDir = path.join(process.cwd(), 'tests', 'mock-locales');
  const enJson = '{"help":"Help text"}';
  const esJson = '{"help":"Texto de ayuda"}';

  beforeAll(() => {
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);
    fs.writeFileSync(path.join(testDir, 'en-US.json'), enJson);
    fs.writeFileSync(path.join(testDir, 'es-ES.json'), esJson);
  });
  afterAll(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });
  afterEach(() => {
    clearLocales();
    jest.clearAllMocks();
  });

  it('loads locales from directory', () => {
    mockFs.readdirSync.mockReturnValue(['en-US.json', 'es-ES.json']);
    mockFs.readFileSync.mockImplementation((file) => {
      if (file.endsWith('en-US.json')) return enJson;
      if (file.endsWith('es-ES.json')) return esJson;
      return '';
    });
    setupLocales({
      fsLib: mockFs,
      localesDir: testDir,
      log: mockLogger
    });
    expect(locales['en-US'].help).toBe('Help text');
    expect(locales['es-ES'].help).toBe('Texto de ayuda');
  });

  it('returns empty and does not warn if directory read fails', () => {
    mockFs.readdirSync.mockImplementation(() => { throw new Error('fail'); });
    setupLocales({
      fsLib: mockFs,
      localesDir: testDir,
      log: mockLogger
    });
    // No warning expected if warning is commented out
    expect(mockLogger.warn).not.toHaveBeenCalled();
  });

  it('logs error if locale is not a flat string map', () => {
    mockFs.readdirSync.mockReturnValue(['bad.json']);
    mockFs.readFileSync.mockReturnValue(JSON.stringify({ nested: { value: 'no' } }));
    setupLocales({ fsLib: mockFs, localesDir: testDir, log: mockLogger });
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('Failed to load or parse locale file bad.json:'),
      expect.any(TypeError)
    );
  });

  it('logs error if file parse fails', () => {
    mockFs.readdirSync.mockReturnValue(['en-US.json']);
    mockFs.readFileSync.mockImplementation(() => '{bad json');
    setupLocales({
      fsLib: mockFs,
      localesDir: testDir,
      log: mockLogger
    });
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining('Failed to load or parse locale file en-US.json:'),
      expect.any(Error)
    );
  });

  it('clears previously loaded locales before loading', () => {
    locales['stale'] = { old: 'value' };
    mockFs.readdirSync.mockReturnValue(['en-US.json']);
    mockFs.readFileSync.mockReturnValue(enJson);
    setupLocales({ fsLib: mockFs, localesDir: testDir, log: mockLogger });
    expect(locales.stale).toBeUndefined();
    expect(locales['en-US'].help).toBe('Help text');
  });

  it('msg returns correct message and falls back', () => {
    locales['en-US'] = { help: 'Help text' };
    delete locales['es-ES'];
    expect(msg('en-US', 'help', undefined, defaultMockLogger)).toBe('Help text');
    delete locales['en-US'];
    expect(msg('es-ES', 'help', 'default', defaultMockLogger)).toBe('default');
  });
  it("covers missing locale, missing key, and default locale branches", () => {
    locales["en-US"] = { help: "Help text" };
    expect(msg("fr-FR", "help", "fallback", defaultMockLogger)).toBe("Help text");
    expect(defaultMockLogger.warn).toHaveBeenCalledWith("Locale \"fr-FR\" not found, falling back to default.");
    expect(msg("en-US", "missing", "fallback", defaultMockLogger)).toBe("fallback");
    expect(defaultMockLogger.warn).toHaveBeenCalledWith("Key \"missing\" not found in locale \"en-US\", returning default value.");
    clearLocales();
    expect(msg("fr-FR", "help", "fallback", defaultMockLogger)).toBe("fallback");
    expect(defaultMockLogger.error).toHaveBeenCalledWith("Default locale \"en-US\" not found. Returning default value.");
  });

  it("handles missing directories and failed file reads", () => {
    const fsWithExists = { ...mockFs, existsSync: jest.fn().mockReturnValue(false) };
    expect(setupLocales({ fsLib: fsWithExists, localesDir: testDir, log: mockLogger }).loadedLocales).toEqual([]);
    const fsWithReadFailure = { ...mockFs, readdirSync: jest.fn().mockReturnValue(["en-US.json", "notes.txt"]), existsSync: jest.fn().mockReturnValue(true), readFileSync: jest.fn(() => { throw new Error("read fail"); }) };
    setupLocales({ fsLib: fsWithReadFailure, localesDir: testDir, log: mockLogger });
    expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining("Failed to load or parse locale file en-US.json:"), expect.any(Error));
  });

  it("clears locales", () => {
    locales["en-US"] = { help: "Help text" };
    clearLocales();
    expect(locales).toEqual({});
  });
});

describe('default locale API branches', () => {
  it('uses default msg arguments', async () => {
    locales['en-US'] = { hello: 'Hello' };
    expect(await withSilentDefaultLog(() => msg('en-US', 'missing'))).toBe('A serious error occurred.');
  });

  it('uses default setupLocales options', async () => {
    expect(await withSilentDefaultLog(() => setupLocales())).toEqual({ msg, loadedLocales: [] });
  });
});
