import { jest } from "@jest/globals";
import { createSignalCleanupHook } from "../src/signal-cleanup.mjs";

describe("createSignalCleanupHook", () => {
  it("cleans up before calling the user hook", async () => {
    const calls = [];
    const cleanup = jest.fn(() => calls.push("cleanup"));
    const userHook = jest.fn(() => calls.push("hook"));
    await createSignalCleanupHook(cleanup, userHook)("SIGTERM");
    expect(calls).toEqual(["cleanup", "hook"]);
    expect(userHook).toHaveBeenCalledWith("SIGTERM");
  });

  it("supports an absent user hook", async () => {
    await expect(createSignalCleanupHook(jest.fn())("SIGINT")).resolves.toBeUndefined();
  });

  it("does not call the user hook when cleanup fails", async () => {
    const userHook = jest.fn();
    await expect(
      createSignalCleanupHook(
        jest.fn().mockRejectedValue(new Error("cleanup failed")),
        userHook,
      )("SIGTERM"),
    ).rejects.toThrow("cleanup failed");
    expect(userHook).not.toHaveBeenCalled();
  });
});
