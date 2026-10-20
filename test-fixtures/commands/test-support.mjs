import { fileURLToPath } from "node:url";
import { jest } from "@jest/globals";

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
