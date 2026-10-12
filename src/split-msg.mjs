export function splitMsg(message, maxLength = 2000) {
  if (typeof message !== "string") throw new TypeError("msg must be a string.");
  if (!Number.isInteger(maxLength) || maxLength < 1) {
    throw new RangeError("maxLength must be a positive integer.");
  }
  let remaining = message.trim();
  if (!remaining) return [];
  if (remaining.length <= maxLength) return [remaining];

  const chunks = [];
  while (remaining.length > maxLength) {
    const start = remaining.slice(0, maxLength);
    let splitIndex = start.lastIndexOf("\n");
    if (splitIndex === -1) splitIndex = start.lastIndexOf(".");
    if (splitIndex === -1 || splitIndex < 1) splitIndex = maxLength;
    else splitIndex += 1;
    chunks.push(remaining.slice(0, splitIndex).trim());
    remaining = remaining.slice(splitIndex).trim();
  }
  chunks.push(remaining);
  return chunks;
}
