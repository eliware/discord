import { jest } from "@jest/globals";

export const log = {
  child: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
};

const setupLog = { debug: jest.fn(), error: jest.fn(), info: jest.fn(), warn: jest.fn() };
setupLog.child = jest.fn(() => setupLog);

export const setup = {
  log: setupLog,
  setupLocalesFn: () => ({ msg: jest.fn(), loadedLocales: [] }),
  setupCommandsFn: async () => ({ commandDefs: [], commandHandlers: {} }),
  setupEventsFn: async () => ({ loadedEvents: [], cleanup: jest.fn() }),
};
