import { EventConfig, EventExecute } from '../../../types/event.mjs';
import { Events } from 'discord.js';
import '../../../client-Ci-GbmCp.mjs';

declare const config: EventConfig;
declare const OnPrefixCommand: EventExecute<Events.MessageCreate>;

export { config, OnPrefixCommand as default };
