import { ClientOptions } from 'discord.js';
import express from 'express';
import { createServer } from 'http';
import { a as Client } from './client-Ci-GbmCp.mjs';

interface DJBClientOptions {
    mongoDb?: boolean;
}
declare class DJBClient {
    client: Client;
    app: express.Express;
    server: ReturnType<typeof createServer>;
    djbOptions?: DJBClientOptions;
    constructor(options: ClientOptions, djbOptions?: DJBClientOptions);
    private setupServer;
    private setupClient;
    private setupDatabase;
    start(): void;
}

export { DJBClient };
