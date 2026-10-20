import { splitMsg } from "../src/split-msg.mjs";

it("does not return empty chunks for repeated line breaks", () => {
  expect(splitMsg("a\n\nb", 2)).toEqual(["a", "b"]);
});
