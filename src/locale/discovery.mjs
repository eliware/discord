import { path } from "@eliware/path";
import { readdirSync } from "fs";

export const discoverLocaleFiles = ({
  localesDir = path(import.meta, "..", "..", "locales"),
  fsLib = { readdirSync },
} = {}) => {
  try {
    if (fsLib.existsSync && !fsLib.existsSync(localesDir)) return [];
    return fsLib.readdirSync(localesDir).filter((file) => file.endsWith(".json"));
  } catch {
    return [];
  }
};
