import { ClientOptions } from 'discord.js';
import { a as Client } from './client-Ci-GbmCp.js';

interface DJBClientOptions {
    mongoDb?: boolean;
}
declare class DJBClient {
    client: Client;
    private app;
    private server;
    private djbOptions?;
    constructor(options: ClientOptions, djbOptions?: DJBClientOptions);
    private setupServer;
    private setupClient;
    private setupDatabase;
    start(): void;
}

export { DJBClient };
