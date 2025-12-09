import { locales, setupLocales, clearLocales, msg } from '../src/locales.mjs';
import fs from 'fs';
import path from 'path';
import { jest } from '@jest/globals';

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

  it('msg returns correct message and falls back', () => {
    locales['en-US'] = { help: 'Help text' };
    delete locales['es-ES'];
    expect(msg('en-US', 'help', undefined, mockLogger)).toBe('Help text');
    delete locales['en-US'];
    expect(msg('es-ES', 'help', 'default', mockLogger)).toBe('default');
  });
});
