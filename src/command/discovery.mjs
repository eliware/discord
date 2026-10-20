export const discoverCommandFiles = ({ commandsDir, fsLib, log }) => {
  try {
    if (fsLib.existsSync && !fsLib.existsSync(commandsDir)) {
      log.warn(`Commands directory does not exist: ${commandsDir}`);
      return [];
    }
    return fsLib.readdirSync(commandsDir).filter((file) => file.endsWith(".json"));
  } catch {
    log.warn(`Commands directory missing or unreadable: ${commandsDir}`);
    return [];
  }
};
