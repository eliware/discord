import { path } from "@eliware/path";
import { readLocaleDirectory } from "./directory-reader.mjs";

export const discoverLocaleFiles = ({
  localesDir = path(import.meta, "..", "..", "locales"),
  fsLib,
  readDirectory = readLocaleDirectory,
} = {}) => {
  return readDirectory({ localesDir, fsLib }).filter((file) => file.endsWith(".json"));
};
