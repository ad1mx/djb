import {
  getClientConfig
} from "../../../chunk-6TLBDZDO.mjs";
import "../../../chunk-L7GWEIC4.mjs";
import {
  log
} from "../../../chunk-SZ4WLV4Y.mjs";

// src/app/events/djb-events/prefix-command.ts
import { Events } from "discord.js";
var config = {
  name: Events.MessageCreate
};
var OnPrefixCommand = async (client, message) => {
  const { content: msg } = message;
  const config2 = await getClientConfig();
  if (message.author.bot || !config2?.prefix || !msg.startsWith(config2.prefix))
    return;
  const splitedMessage = message.content.split(" ");
  const commandName = splitedMessage.shift()?.toLowerCase().slice(config2.prefix.length);
  if (!commandName) return;
  const command = client.commands?.get(commandName);
  if (!command) return;
  const { args, dev, permissions, roles } = command.config;
  if (dev && config2.developerIDs && !config2.developerIDs.includes(message.author.id))
    return;
  const parsedArgs = args?.reduce(
    (map, arg, i) => map.set(arg.name, splitedMessage[i] ?? void 0),
    /* @__PURE__ */ new Map()
  );
  try {
    command.execute(client, message, commandName, parsedArgs || /* @__PURE__ */ new Map());
  } catch (error) {
    log.error("command-execute", `Failed to execute command: ${commandName}`);
  }
};
var prefix_command_default = OnPrefixCommand;
export {
  config,
  prefix_command_default as default
};
