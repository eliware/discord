export const readCommandDirectory = ({ commandsDir, fsLib, log }) => {
  try {
    if (fsLib.existsSync && !fsLib.existsSync(commandsDir)) {
      log.warn(`Commands directory does not exist: ${commandsDir}`);
      return [];
    }
    return fsLib.readdirSync(commandsDir);
  } catch {
    log.warn(`Commands directory missing or unreadable: ${commandsDir}`);
    return [];
  }
};
