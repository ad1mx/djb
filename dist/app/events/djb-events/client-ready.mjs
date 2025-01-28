import {
  log
} from "../../../chunk-SZ4WLV4Y.mjs";

// src/app/events/djb-events/client-ready.ts
import { Events } from "discord.js";
var config = {
  name: Events.ClientReady,
  once: true
};
var ClientReady = async (client) => {
  log.success("client", `Client is ready at '${client.user?.tag}'`);
};
var client_ready_default = ClientReady;
export {
  config,
  client_ready_default as default
};
