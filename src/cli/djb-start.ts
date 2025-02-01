import { DJBClient } from "../djb";
import { log } from "@ad1m/logger";

export const djbStart = () => {
  log.info("djb", "Starting bot...");

  // Instantiate the DJBClient
  const client = new DJBClient({ intents: [] }, { mongoDb: true });

  // Start both the server and Discord bot
  client.start();
};
