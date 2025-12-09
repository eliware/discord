// Type definitions for locales setup and management
import type { Logger } from '@eliware/log';

export interface SetupLocalesOptions {
  localesDir?: string;
  log?: Logger;
  fsLib?: {
    readdirSync: (...args: any[]) => string[];
    readFileSync: (...args: any[]) => string;
  };
}

export interface Locales {
  [locale: string]: Record<string, string>;
}

export interface SetupLocalesResult {
  msg: (locale: string, key: string, defaultValue?: string, log?: Logger) => string;
  loadedLocales: string[];
}

/**
 * Loads all locale files from the specified directory into memory.
 */
export function setupLocales(options?: SetupLocalesOptions): SetupLocalesResult;

/**
 * Clears all loaded locales from memory.
 */
export function clearLocales(): void;

/**
 * Retrieves a localized message for a given locale and key.
 */
export function msg(locale: string, key: string, defaultValue?: string, log?: Logger): string;

/**
 * In-memory object containing all loaded locales.
 */
export const locales: Locales;
