// Type definitions for event setup and registration
import type { Client } from 'discord.js';
import type { Logger } from '@eliware/common';

export interface SetupEventsOptions {
  client: Client;
  eventsDir: string;
  log?: Logger;
  msg?: (locale: string, key: string, defaultMsg?: string) => string;
  commandHandlers?: Record<string, (...args: any[]) => any>;
  context?: Record<string, unknown>;
  onHandlerError?: (error: unknown, eventName: string) => void;
  fsLib?: {
    readdirSync: (...args: any[]) => string[];
  };
  importFn?: (path: string) => Promise<any>;
}

export interface SetupEventsResult {
  loadedEvents: string[];
  cleanup: () => void;
}

export function setupEvents(options: SetupEventsOptions): Promise<SetupEventsResult>;
