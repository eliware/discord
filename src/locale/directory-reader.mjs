import { readdirSync } from "fs";

export const readLocaleDirectory = ({ localesDir, fsLib = { readdirSync } } = {}) => {
  try {
    if (fsLib.existsSync && !fsLib.existsSync(localesDir)) return [];
    return fsLib.readdirSync(localesDir);
  } catch {
    return [];
  }
};
