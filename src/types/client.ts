import { Collection as BaseCollection, Client as BaseClient } from "discord.js";
import { Command } from "./command";

export interface CommandCollection<commandName = string, data = Command>
  extends BaseCollection<commandName, data> {}

export class Client extends BaseClient {
  commands?: CommandCollection;
}

export type ClientConfig = {
  prefix: string;
  developerIDs?: string[];
};
