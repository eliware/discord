import { jest } from "@jest/globals";
import { reconcileCommands } from "../../../src/command/registration/reconcile.mjs";

describe("reconcileCommands", () => {
  it("updates a matching command without creating a duplicate", async () => {
    const request = { createCommand: jest.fn(), updateCommand: jest.fn() };
    const commandDefs = [{ name: "managed", description: "New description" }];
    const existingCommands = [
      { id: "managed-id", name: "managed", description: "Old description" },
      { id: "unrelated-id", name: "other" },
    ];

    await reconcileCommands({ commandDefs, existingCommands, request });

    expect(request.updateCommand).toHaveBeenCalledWith("managed-id", commandDefs[0]);
    expect(request.createCommand).not.toHaveBeenCalled();
  });

  it("treats command types as part of a match", async () => {
    const request = { createCommand: jest.fn(), updateCommand: jest.fn() };
    const commandDef = { name: "help", type: 1 };

    await reconcileCommands({
      commandDefs: [commandDef],
      existingCommands: [{ id: "user-id", name: "help", type: 2 }],
      request,
    });

    expect(request.createCommand).toHaveBeenCalledWith(commandDef);
    expect(request.updateCommand).not.toHaveBeenCalled();
  });

  it("does not send requests when there are no definitions", async () => {
    const request = { createCommand: jest.fn(), updateCommand: jest.fn() };

    await reconcileCommands({ commandDefs: [], existingCommands: [], request });

    expect(request.createCommand).not.toHaveBeenCalled();
    expect(request.updateCommand).not.toHaveBeenCalled();
  });
});
