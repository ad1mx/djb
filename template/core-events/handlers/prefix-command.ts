import { log } from "@ad1m/logger";
import { EventConfig, EventExecute } from "@/src/types/event";
import { validateCommand } from "@/src/utils/validators/prefix-command";
import { Collection, Events } from "discord.js";

export const config: EventConfig = {
  name: Events.MessageCreate,
};

const PrefixCommandHandler: EventExecute<Events.MessageCreate> = async (
  client,
  message
) => {
  const { content: msg } = message;

  if (
    message.author.bot ||
    !client.config?.prefix ||
    !msg.startsWith(client.config.prefix)
  )
    return;

  const args = message.content.split(" ");
  const commandName = args
    .shift()
    ?.toLowerCase()
    .slice(client.config.prefix.length);

  if (!commandName) return;

  const command = client.commands?.get(commandName);

  if (!command) return;

  const parsedArgs =
    command.config.args?.reduce(
      (map, arg, i) => map.set(arg.name, args[i] ?? undefined),
      new Collection<string, string>()
    ) || new Collection();

  const validCommand = await validateCommand(
    client.config,
    command.config,
    commandName,
    message,
    parsedArgs,
    client
  );

  if (!validCommand.valid && validCommand.message)
    return await message.reply({ content: validCommand.message });
  else if (!validCommand.valid) return;

  try {
    await command.execute(
      client,
      message,
      commandName,
      validCommand.parsedArgs
    );
  } catch (error) {
    log.error("command-execute", `Failed to execute command: ${commandName}`);
    console.error(error);
  }
};

export default PrefixCommandHandler;
