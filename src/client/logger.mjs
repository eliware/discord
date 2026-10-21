export const createClientLogger = (log, clientId) => log.child({ component: "discord", clientId });
