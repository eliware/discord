import { path } from "@eliware/path";
import { readLocaleDirectory } from "./directory-reader.mjs";
import { filterLocaleFiles } from "./filter.mjs";

export const discoverLocaleFiles = ({
  localesDir = path(import.meta, "..", "..", "locales"),
  fsLib,
  readDirectory = readLocaleDirectory,
} = {}) => {
  return filterLocaleFiles(readDirectory({ localesDir, fsLib }));
};
