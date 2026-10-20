import { log as sharedLog } from "@eliware/log";

export const withSilentDefaultLog = async (fn) => {
  const transports = sharedLog.transports ?? [];
  const previous = transports.map((transport) => transport.silent);
  transports.forEach((transport) => {
    transport.silent = true;
  });
  try {
    return await fn();
  } finally {
    transports.forEach((transport, index) => {
      transport.silent = previous[index];
    });
  }
};
