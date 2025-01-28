// src/types/client.ts
import { Client as BaseClient } from "discord.js";
var Client = class extends BaseClient {
  commands;
};

export {
  Client
};
