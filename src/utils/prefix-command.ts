import { inlineCode, Message, OmitPartialGroupDMChannel } from "discord.js";
import { CommandArg, CommandArgType, CommandConfig } from "../types/command";
import { Client, ClientConfig } from "../types/client";

export const getCommandSyntax = (
  prefix: string,
  commandName: string,
  commandConfig: CommandConfig,
  args: CommandArg[]
) => {
  const argsString = args.map((v) => `<${v.name}>`).join(" ");

  // return `Syntax: ${inlineCode(`${prefix}${commandName} ${argsString}`)}`; // Previous version
  return (
    "❌  **Missing arguments**! Please use the correct syntax:\n" +
    inlineCode(`${prefix}${commandName} ${argsString}`) +
    `\n\n${commandConfig.description}.\n` +
    args.map((v) => `- **${v.name}**: ${v.description}\n`).join("")
  );
};

type ValidateCommandResponse =
  | { valid: false; message: string }
  | { valid: false; message?: undefined }
  | { valid: true; parsedArgs: Map<string, any> };

export const validateCommand = async (
  clientConfig: ClientConfig,
  commandConfig: CommandConfig,
  commandName: string,
  message: OmitPartialGroupDMChannel<Message>,
  args: Map<string, any>,
  client: Client
): Promise<ValidateCommandResponse> => {
  // Dev command
  if (
    commandConfig.dev &&
    clientConfig.developerIDs &&
    !clientConfig.developerIDs.includes(message.author.id)
  )
    return { valid: false };

  // Args validating
  if (commandConfig.args)
    for (const arg of commandConfig.args) {
      const value = args.get(arg.name);

      // Missing required arg
      if (arg.required && !value)
        return {
          valid: false,
          message: getCommandSyntax(
            clientConfig.prefix,
            commandName,
            commandConfig,
            commandConfig.args
          ),
        };

      // Not same arg type
      if (value) {
        switch (arg.type) {
          case CommandArgType.NUMBER:
            if (isNaN(Number(value))) {
              return {
                valid: false,
                message: `❌  **Invalid argument:** \`${arg.name}\` must be a number.`,
              };
            }
            args.set(arg.name, Number(value));
            break;

          case CommandArgType.BOOLEAN:
            if (!["true", "false"].includes(value?.toLowerCase())) {
              return {
                valid: false,
                message: `❌  **Invalid argument:** \`${arg.name}\` must be either \`true\` or \`false\`.`,
              };
            }
            args.set(arg.name, value.toLowerCase() === "true");
            break;

          case CommandArgType.USER:
            if (!/^<@!?(\d+)>$/.test(value)) {
              return {
                valid: false,
                message: `❌  **Invalid argument:** \`${arg.name}\` must be a valid user mention.`,
              };
            }
            const userId = value.match(/^<@!?(\d+)>$/)?.[1];
            const user = await client.users.fetch(userId);

            args.set(arg.name, user);
            break;

          case CommandArgType.MEMBER:
            if (!/^<@!?(\d+)>$/.test(value)) {
              return {
                valid: false,
                message: `❌  **Invalid argument:** \`${arg.name}\` must be a valid member mention.`,
              };
            }
            const memberId = value.match(/^<@!?(\d+)>$/)?.[1];
            const member = message.guild?.members.cache.get(memberId);

            args.set(arg.name, member);
            break;

          case CommandArgType.ROLE:
            if (!/^<@&(\d+)>$/.test(value)) {
              return {
                valid: false,
                message: `❌  **Invalid argument:** \`${arg.name}\` must be a valid role mention.`,
              };
            }

            const roleId = value.match(/^<@&(\d+)>$/)?.[1];
            const role = message.guild?.roles.cache.get(roleId);

            args.set(arg.name, role);
            break;

          case CommandArgType.CHANNEL:
            if (!/^<#(\d+)>$/.test(value)) {
              return {
                valid: false,
                message: `❌  **Invalid argument:** \`${arg.name}\` must be a valid channel mention.`,
              };
            }

            const channelId = value.match(/^<#(\d+)>$/)?.[1];
            const channel = message.guild?.channels.cache.get(channelId);

            args.set(arg.name, channel);
            break;

          case CommandArgType.STRING:
          default:
            args.set(arg.name, value);
            break;
        }
      }
    }

  return { valid: true, parsedArgs: args };
};
