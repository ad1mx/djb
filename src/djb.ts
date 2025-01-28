import "dotenv/config";
import { ClientOptions, Collection } from "discord.js";
import express from "express";
import { createServer } from "http";
import { connectToDb } from "./lib/mongo";
import { log } from "./lib/logger";
import { getClientConfig, initHandlers } from "./utils/handler";
import { Client } from "./types/client";

interface DJBClientOptions {
  mongoDb?: boolean;
}

export class DJBClient {
  public client: Client;
  public app: express.Express;
  public server: ReturnType<typeof createServer>;
  public djbOptions?: DJBClientOptions;

  constructor(options: ClientOptions, djbOptions?: DJBClientOptions) {
    this.client = new Client(options);
    this.djbOptions = djbOptions;
    this.app = express();
    this.server = createServer(this.app);
  }

  private setupServer() {
    this.app.get("/", (req, res) => {
      res.send("Hello world!");
    });

    const port = process.env.DJB_PORT || 3000;
    this.server.listen(port, () => {
      log.success("server", `App is running on port '${port}'`);
    });
  }

  private setupClient() {
    this.client.commands = new Collection();

    const config = getClientConfig();
    if (!config)
      throw new Error(
        "No config file found, please mrovide a valid config.js file."
      );

    initHandlers(this.client);
  }

  private setupDatabase() {
    if (!process.env.DJB_MONGODB_URI)
      throw new Error("MONGODB_URI env must be provided when mongoDb is true");
    connectToDb(process.env.DJB_MONGODB_URI ?? "");
  }

  public start() {
    this.setupServer();
    if (this.djbOptions?.mongoDb) this.setupDatabase();
    this.setupClient();

    if (!process.env.DJB_TOKEN)
      throw new Error("DJB_TOKEN env must be provided");
    this.client.login(process.env.DJB_TOKEN);
  }
}
