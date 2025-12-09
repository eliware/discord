import logger from '@eliware/log';
import { path, pathUrl } from '@eliware/path';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';

/**
 * Loads and registers Discord commands from JSON files and their handlers.
 * @param {Object} options - Options for setting up commands
 * @param {Object} options.client - Discord client instance (optional, may be used by handlers)
 * @param {string} options.commandsDir - Directory path for commands
 * @param {Object} [options.log] - Logger instance
 * @param {string} [options.msg] - Optional message or context
 * @param {Object} [options.fsLib] - File system library (for testing)
 * @param {Function} [options.importFn] - Function to import handlers (for testing)
 * @returns {Promise<{commandDefs: Array, commandHandlers: Object}>} Map of command names to handler functions and command definitions
 */
export const setupCommands = async ({
    client,
    commandsDir,
    log = logger,
    msg,
    fsLib = { readdirSync, readFileSync, existsSync },
    importFn = (p) => import(p),
} = {}) => {
    let files = [];
    try {
        // Check if directory exists before reading
        if (fsLib.existsSync && !fsLib.existsSync(commandsDir)) {
            log.warn(`Commands directory does not exist: ${commandsDir}`);
            return { commandDefs: [], commandHandlers: {} };
        }
        files = fsLib.readdirSync(commandsDir).filter(f => f.endsWith('.json'));
    } catch (err) {
        log.warn(`Commands directory missing or unreadable: ${commandsDir}`);
        return { commandDefs: [], commandHandlers: {} };
    }
    const commandHandlers = {};
    const commandDefs = [];
    for (const file of files) {
        try {
            const def = JSON.parse(fsLib.readFileSync(path(commandsDir, file), 'utf8'));
            const cmdName = file.replace(/\.json$/, '');
            const handlerPath = path(commandsDir, cmdName + '.mjs');
            if (fsLib.existsSync(handlerPath)) {
                try {
                    const handlerUrl = pathUrl(handlerPath);
                    const mod = await importFn(handlerUrl);
                    if (typeof mod.default !== 'function') {
                        log.warn(`Handler for ${cmdName} does not export a default function.`);
                        continue;
                    }
                    commandDefs.push(def);
                    commandHandlers[cmdName] = mod.default;
                } catch (e) {
                    log.warn(`Failed to load handler for ${cmdName}:`, e);
                }
            } else {
                log.warn(`No handler found for command ${cmdName}`);
            }
        } catch (err) {
            log.error(`Failed to load command definition for ${file}:`, err);
            continue;
        }
    }
    return { commandDefs, commandHandlers };
};

/**
 * Registers Discord commands with the Discord API.
 * @param {Object} options - Options for registering commands
 * @param {Array} options.commandDefs - Array of command definitions
 * @param {string} [options.clientId] - Discord client ID
 * @param {string} [options.token] - Discord app token
 * @param {Object} [options.log] - Logger instance
 * @param {Object} [options.restClass=REST] - REST class (for testing)
 * @param {Object} [options.routes=Routes] - Discord.js Routes (for testing)
 * @returns {Promise<boolean>} True if registration succeeded, false otherwise
 */
export const registerCommands = async ({
    commandDefs,
    clientId = process.env.DISCORD_CLIENT_ID,
    token = process.env.DISCORD_TOKEN,
    log = logger,
    restClass = REST,
    routes = Routes,
}) => {
    if (!token) {
        log.warn('DISCORD_TOKEN is not set. Skipping command registration.');
        return false;
    }
    if (!clientId) {
        log.warn('DISCORD_CLIENT_ID is not set. Skipping command registration.');
        return false;
    }
    if (!commandDefs.length) {
        log.warn('No commands to register.');
        return false;
    }

    try {
        const rest = new restClass({ version: '10' }).setToken(token);
        await rest.put(
            routes.applicationCommands(clientId),
            { body: commandDefs }
        );
        log.debug(`Registered ${commandDefs.length} commands successfully.`);
        return true;
    } catch (error) {
        if (error && error.status === 401) {
            log.error('Failed to register commands: Unauthorized (401). Please check your Discord token and client ID.');
        } else if (error && error.status === 403) {
            log.error('Failed to register commands: Forbidden (403). The bot may lack permissions.');
        } else {
            log.error('Failed to register commands:', error.message || error);
        }
        return false;
    }
};


/**
 * Purges all global and (optionally) guild-specific application commands.
 * @param {Object} options - Options for purging commands
 * @param {string} [options.clientId] - Discord client ID
 * @param {string} [options.token] - Discord app token
 * @param {string|null} [options.guildId] - Guild ID to purge (optional)
 * @param {Object} [options.log] - Logger instance
 * @param {Object} [options.restClass=REST] - REST class
 * @param {Object} [options.routes=Routes] - Discord.js Routes
 * @returns {Promise<void>}
 */
export async function purgeCommands({
    clientId = process.env.DISCORD_CLIENT_ID,
    token = process.env.DISCORD_TOKEN,
    guildId = process.env.DISCORD_GUILD_ID || null,
    log = logger,
    restClass = REST,
    routes = Routes
}) {
    if (!token || !clientId) {
        log.error('DISCORD_TOKEN and DISCORD_CLIENT_ID must be set in your environment.');
        throw new Error('Missing credentials');
    }
    const rest = new restClass({ version: '10' }).setToken(token);
    if (guildId) {
        await rest.put(routes.applicationGuildCommands(clientId, guildId), { body: [] });
        log.info(`All application commands purged for guild ${guildId}.`);
    } else {
        await rest.put(routes.applicationCommands(clientId), { body: [] });
        log.info('All global application commands purged.');
    }
}
