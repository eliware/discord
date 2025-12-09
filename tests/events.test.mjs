import { setupEvents } from '../src/events.mjs';
import fs from 'fs';
import path from 'path';
import { jest } from '@jest/globals';

describe('setupEvents', () => {
  let eventDir;
  let eventFile;

  beforeAll(() => {
    eventDir = path.join(process.cwd(), 'tests', 'mock-events');
    if (!fs.existsSync(eventDir)) fs.mkdirSync(eventDir);
    eventFile = path.join(eventDir, 'ready.mjs');
    fs.writeFileSync(eventFile, 'export default () => {}');
  });

  afterAll(() => {
    fs.rmSync(eventDir, { recursive: true, force: true });
  });

  it('loads and attaches event handlers', async () => {
    const mockClient = { on: jest.fn() };
    const files = ['ready.mjs'];
    jest.spyOn(fs, 'readdirSync').mockReturnValue(files);
    const importFn = jest.fn().mockResolvedValue({ default: jest.fn() });
    await setupEvents({
      client: mockClient,
      eventsDir: eventDir,
      log: { info: jest.fn(), error: jest.fn(), warn: jest.fn() },
      importFn
    });
    expect(mockClient.on).toHaveBeenCalledWith('ready', expect.any(Function));
    jest.restoreAllMocks();
  });
});
