import { ClientEvents } from 'discord.js';
import { a as Client } from '../client-Ci-GbmCp.mjs';

type EventConfig = {
    name: keyof ClientEvents;
    once?: boolean;
};
/**
 * Event execute function
 */
type EventExecute<Event extends keyof ClientEvents> = (client: Client, ...args: ClientEvents[Event]) => void;
type Event = {
    config: EventConfig;
    execute: EventExecute<any>;
};

export type { Event, EventConfig, EventExecute };
