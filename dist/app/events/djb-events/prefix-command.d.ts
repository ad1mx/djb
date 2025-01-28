import { EventConfig, EventExecute } from '../../../types/event.js';
import { Events } from 'discord.js';
import '../../../client-Ci-GbmCp.js';

declare const config: EventConfig;
declare const OnPrefixCommand: EventExecute<Events.MessageCreate>;

export { config, OnPrefixCommand as default };
