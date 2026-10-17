import { jest } from "@jest/globals";

export const log = {
  child: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
};

export const setup = {
  log: { debug: jest.fn(), error: jest.fn(), info: jest.fn(), warn: jest.fn() },
  setupLocalesFn: () => ({ msg: jest.fn(), loadedLocales: [] }),
  setupCommandsFn: async () => ({ commandDefs: [], commandHandlers: {} }),
  setupEventsFn: async () => ({ loadedEvents: [], cleanup: jest.fn() }),
};
