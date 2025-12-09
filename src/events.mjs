import logger from '@eliware/log';
import { pathUrl } from '@eliware/path';
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
    fsLib = { readdirSync },
    importFn = (p) => import(p),
} = {}) => {
    const files = fsLib.readdirSync(eventsDir).filter(f => f.endsWith('.mjs'));
    const loadedEvents = [];
    for (const file of files) {
        const eventName = file.replace(/\.mjs$/, '');
        try {
            const handler = await importFn(pathUrl(eventsDir, file));
            if (!client) throw new Error('Discord client is undefined');
            if (typeof handler.default === 'function') {
                client.on(eventName, (...eventArgs) => {
                    const handlerContext = { client, log, msg, ...context };
                    if (eventName === 'interactionCreate') handlerContext.commandHandlers = commandHandlers;
                    handler.default(handlerContext, ...eventArgs);
                });
            }
            loadedEvents.push(eventName);
        } catch (err) {
            log.error(`Failed to load event ${eventName}:`, err);
        }
    }
    return { loadedEvents };
};