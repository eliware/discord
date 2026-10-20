import { jest } from "@jest/globals";
import { loginDiscordClient } from "../src/lifecycle.mjs";

it("returns the successful Discord login result", async () => {
  const client = { login: jest.fn().mockResolvedValue("connected") };
  await expect(loginDiscordClient(client, "token")).resolves.toBe("connected");
  expect(client.login).toHaveBeenCalledWith("token");
});

it("adds context to a Discord login error", async () => {
  const cause = new Error("login failed");
  const client = { login: jest.fn().mockRejectedValue(cause) };
  await expect(loginDiscordClient(client, "token")).rejects.toMatchObject({
    message: "Discord sign-in failed: login failed",
    cause,
  });
});
