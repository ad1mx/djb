import { b as ClientConfig, a as Client } from '../client-Ci-GbmCp.mjs';
import 'discord.js';

type HandlerFile<T> = {
    parent: string;
    name: string;
    data: T;
};
declare const getClientConfig: () => Promise<ClientConfig | undefined>;
declare const loadFiles: <T>(dirPath: string) => Promise<HandlerFile<T>[]>;
declare const initHandlers: (client: Client) => Promise<never[] | undefined>;

export { type HandlerFile, getClientConfig, initHandlers, loadFiles };
