import { EventConfig, EventExecute } from '../../../types/event.js';
import { Events } from 'discord.js';
import '../../../client-Ci-GbmCp.js';

declare const config: EventConfig;
declare const ClientReady: EventExecute<Events.ClientReady>;

export { config, ClientReady as default };
