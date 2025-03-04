import { Client as BaseClient, ClientOptions, Collection } from "discord.js";
import "dotenv/config";
import { connectToDb } from "./lib/mongo";
import { getClientConfig, initHandlers } from "./utils/handler";
import { Command } from "./types/command";
import { SelectMenu } from "./types/select-menu";
import { Modal } from "./types/modal";
import { Button } from "./types/button";

export type ClientConfig = {
  prefix: string;
  description?: string;
  ownerIds?: string[];
};

interface DJBClientOptions {
  mongoDb?: boolean;
}

export class DJBClient extends BaseClient {
  public config?: ClientConfig;
  public cache = new Collection<string, any>();
  public commands = new Collection<string, Command>();
  public selectMenus = new Collection<string, SelectMenu>();
  public modals = new Collection<string, Modal>();
  public buttons = new Collection<string, Button>();
  public djbOptions?: DJBClientOptions;

  constructor(options: ClientOptions, djbOptions?: DJBClientOptions) {
    super(options);
    this.djbOptions = djbOptions;
  }

  private async setupClient() {
    this.config = await getClientConfig();
    initHandlers(this);
  }

  private setupDatabase() {
    if (!process.env.DJB_MONGODB_URI) {
      throw new Error("MONGODB_URI env must be provided when mongoDb is true");
    }
    connectToDb(process.env.DJB_MONGODB_URI ?? "");
  }

  public start() {
    if (this.djbOptions?.mongoDb) this.setupDatabase();
    this.setupClient();

    if (!process.env.DJB_TOKEN) {
      throw new Error("DJB_TOKEN env must be provided");
    }

    this.login(process.env.DJB_TOKEN);
  }
}
