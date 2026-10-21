import { runPurgeCoordinator } from "./purge/coordinator.mjs";

export const purgeCommands = (options) => runPurgeCoordinator(options);
