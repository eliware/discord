import { log as logger, pathUrl } from '@eliware/common';
import { readdirSync } from 'fs';

/**
 * Loads and attaches all event handlers from the events directory to the Discord client.
 * @param {Object} options - Options for setting up events
 * @param {import('discord.js').Client} options.client - The Discord client instance
 * @param {string} options.eventsDir - Directory path for events
 * @param {import('@eliware/log').Logger} [options.log] - Logger instance
 * @param {Function} [options.msg] - Localization function (locale, key, defaultMsg?) => string (optional)
 * @param {Object} [options.commandHandlers] - Map of command handlers (optional)
 * @param {Object} [options.fsLib] - File system library (for testing)
 * @param {Function} [options.importFn] - Function to import handlers (for testing)
 * @returns {Promise<{ loadedEvents: string[] }>} Object with loadedEvents array
 */
export const setupEvents = async ({
    client,
    eventsDir,
    log = logger,
    msg = (locale, key, defaultMsg) => {
        log.warn(`Localization function not provided. Returning default message for ${key}.`);
        return defaultMsg || 'An error occurred.';
    },
    commandHandlers = {},
    context = {},
    onHandlerError = (error, eventName) => log.error(`Event handler failed for ${eventName}:`, error),
    fsLib = { readdirSync },
    importFn = (p) => import(p),
} = {}) => {
    let files = [];
    try {
        files = fsLib.readdirSync(eventsDir).filter(f => f.endsWith('.mjs'));
    } catch {
        log.warn(`Events directory missing or unreadable: ${eventsDir}`);
        return { loadedEvents: [] };
    }
    const loadedEvents = [];
    const listeners = [];
    const cleanup = () => {
        for (const [eventName, listener] of listeners) {
            if (typeof client.off === 'function') client.off(eventName, listener);
            else if (typeof client.removeListener === 'function') client.removeListener(eventName, listener);
        }
        listeners.length = 0;
    };
    try {
        for (const file of files) {
        const eventName = file.replace(/\.mjs$/, '');
        try {
            const handler = await importFn(pathUrl(eventsDir, file));
            if (!client) throw new Error('Discord client is undefined');
            if (typeof handler.default === 'function') {
                const listener = (...eventArgs) => {
                    const handlerContext = { ...context, client, log, msg };
                    if (eventName === 'interactionCreate') handlerContext.commandHandlers = commandHandlers;
                    Promise.resolve()
                        .then(() => handler.default(handlerContext, ...eventArgs))
                        .catch((error) => {
                            onHandlerError(error, eventName);
                        });
                };
                try {
                    client.on(eventName, listener);
                } catch (error) {
                    error.eventListenerAttach = true;
                    throw error;
                }
                listeners.push([eventName, listener]);
            }
            loadedEvents.push(eventName);
        } catch (err) {
            if (err?.eventListenerAttach) throw err;
            log.error(`Failed to load event ${eventName}:`, err);
            }
        }
    } catch (error) {
        cleanup();
        throw error;
    }
    return { loadedEvents, cleanup };
};