import { ClientEvents } from "discord.js";
import { DJBClient } from "../djb";

export type EventConfig = {
  name: keyof ClientEvents;
  once?: boolean;
};

/**
 * Event execute function
 */
export type EventExecute<Event extends keyof ClientEvents> = (
  client: DJBClient,
  ...args: ClientEvents[Event]
) => void;

export type Event = {
  config: EventConfig;
  execute: EventExecute<any>;
};
