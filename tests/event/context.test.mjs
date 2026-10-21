import { createEventContext } from "../../src/event/context.mjs";

describe("createEventContext", () => {
  it("adds Discord values to the app context", () => {
    const client = {};
    const log = {};
    const msg = () => "message";

    expect(
      createEventContext({ context: { app: true }, client, log, msg, eventName: "ready" }),
    ).toEqual({
      app: true,
      client,
      log,
      msg,
    });
  });

  it("adds command handlers to interaction context", () => {
    const commandHandlers = { ping: () => {} };

    expect(
      createEventContext({
        context: {},
        client: {},
        log: {},
        msg: () => "",
        eventName: "interactionCreate",
        commandHandlers,
      }),
    ).toEqual(expect.objectContaining({ commandHandlers }));
  });
});
