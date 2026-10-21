import { jest } from "@jest/globals";
import { createClientLogger } from "../../src/client/logger.mjs";

it("creates a logger scoped to the Discord client", () => {
  const child = { info: jest.fn() };
  const log = { child: jest.fn(() => child) };

  expect(createClientLogger(log, "app-id")).toBe(child);
  expect(log.child).toHaveBeenCalledWith({ component: "discord", clientId: "app-id" });
});
