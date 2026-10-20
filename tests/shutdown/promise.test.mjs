import { jest } from "@jest/globals";
import { getShutdownPromise } from "../../src/shutdown/promise.mjs";

describe("getShutdownPromise", () => {
  it("creates one promise for a client", () => {
    const client = {};
    const createPromise = jest.fn(() => Promise.resolve());
    const first = getShutdownPromise(client, createPromise);
    const second = getShutdownPromise(client, createPromise);
    expect(second).toBe(first);
    expect(createPromise).toHaveBeenCalledTimes(1);
  });
});
