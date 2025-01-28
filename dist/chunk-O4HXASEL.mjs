import {
  DJBClient
} from "./chunk-M6M36ZSP.mjs";
import {
  log
} from "./chunk-SZ4WLV4Y.mjs";

// src/cli/djb-start.ts
var djbStart = () => {
  log.info("djb", "Starting bot...");
  const client = new DJBClient({ intents: [] }, { mongoDb: true });
  client.start();
};

export {
  djbStart
};
