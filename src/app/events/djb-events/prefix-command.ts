import { getClientConfig } from "@/src/utils/handler";
import { clientConfig } from "../../../constants/config";
import { log } from "../../../lib/logger";
import { EventConfig, EventExecute } from "@/src/types/event";
import { Events } from "discord.js";

export const config: EventConfig = {
  name: Events.MessageCreate,
};

const OnPrefixCommand: EventExecute<Events.MessageCreate> = async (
  client,
  message
) => {
  const { content: msg } = message;
  const config = await getClientConfig();

  if (message.author.bot || !config?.prefix || !msg.startsWith(config.prefix))
    return;

  const splitedMessage = message.content.split(" ");
  const commandName = splitedMessage
    .shift()
    ?.toLowerCase()
    .slice(config.prefix.length);

  if (!commandName) return;

  const command = client.commands?.get(commandName);

  if (!command) return;

  const { args, dev, permissions, roles } = command.config;

  // Dev command
  if (
    dev &&
    config.developerIDs &&
    !config.developerIDs.includes(message.author.id)
  )
    return;

  const parsedArgs = args?.reduce(
    (map, arg, i) => map.set(arg.name, splitedMessage[i] ?? undefined),
    new Map<string, string>()
  );

  try {
    command.execute(client, message, commandName, parsedArgs || new Map());
  } catch (error) {
    log.error("command-execute", `Failed to execute command: ${commandName}`);
  }
};

export default OnPrefixCommand;
