import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";
import { log as sharedLog } from "@eliware/log";

export const mockLogger = { debug: jest.fn(), error: jest.fn(), warn: jest.fn(), info: jest.fn() };
export const mockFs = {
  readdirSync: jest.fn(),
  readFileSync: jest.fn(),
  existsSync: jest.fn(),
};
export const testDir = fileURLToPath(new URL("../../test-fixtures/commands", import.meta.url));
export const testJson = '{"name":"help","description":"Help command"}';
export const testHandler = { default: jest.fn() };

export const resetMocks = () => jest.clearAllMocks();

export const withSilentDefaultLog = async (fn) => {
  const transports = sharedLog.transports ?? [];
  const previous = transports.map((transport) => transport.silent);
  transports.forEach((transport) => {
    transport.silent = true;
  });
  try {
    return await fn();
  } finally {
    transports.forEach((transport, index) => {
      transport.silent = previous[index];
    });
  }
};
