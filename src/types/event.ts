import { ClientEvents } from "discord.js";
import { Client } from "./client";

export type EventConfig = {
  name: keyof ClientEvents;
  once?: boolean;
};

/**
 * Event execute function
 */
export type EventExecute<Event extends keyof ClientEvents> = (
  client: Client,
  ...args: ClientEvents[Event]
) => void;

export type Event = {
  config: EventConfig;
  execute: EventExecute<any>;
};
