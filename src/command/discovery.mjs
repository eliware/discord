import { readCommandDirectory } from "./directory-reader.mjs";

export const discoverCommandFiles = ({
  commandsDir,
  fsLib,
  log,
  readDirectory = readCommandDirectory,
}) => readDirectory({ commandsDir, fsLib, log }).filter((file) => file.endsWith(".json"));
