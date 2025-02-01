import { log } from "@ad1m/logger";
import { EventConfig, EventExecute } from "@/src/types/event";
import { Events } from "discord.js";

export const config: EventConfig = {
  name: Events.ClientReady,
  once: true,
};

const ClientReady: EventExecute<Events.ClientReady> = async (client) => {
  log.success("client", `Client is ready at '${client.user?.tag}'`);
};

export default ClientReady;
