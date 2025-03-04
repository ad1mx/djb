import {
  Collection,
  inlineCode,
  Message,
  OmitPartialGroupDMChannel,
} from "discord.js";
import { CommandArg, CommandArgType, CommandConfig } from "@/types/command";
import ms from "ms";
import { ClientConfig, DJBClient } from "@/src/djb";

const getCommandSyntax = (
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
  | { valid: true; parsedArgs: Collection<string, any> };

export const validateCommand = async (
  clientConfig: ClientConfig,
  commandConfig: CommandConfig,
  commandName: string,
  message: OmitPartialGroupDMChannel<Message>,
  args: Collection<string, any>,
  client: DJBClient
): Promise<ValidateCommandResponse> => {
  // Dev command
  if (
    commandConfig.ownersOnly &&
    clientConfig.ownerIds &&
    !clientConfig.ownerIds.includes(message.author.id)
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

          case CommandArgType.TIME:
            const time = ms(`${value}`);
            const date = new Date(time);
            if (!time || !date)
              return {
                valid: false,
                message: `❌  **Invalid argument:** \`${arg.name}\` must be a valid time, e.g., 30d, 12h, 30m.`,
              };

            args.set(arg.name, time);
            break;

          case CommandArgType.USER:
            const userPattern = /^<@!?(\d+)>$/;
            const userId = value.match(userPattern)?.[1];
            const user = await client.users.fetch(userId);

            if (!userPattern.test(value) || !user)
              return {
                valid: false,
                message: `❌  **Invalid argument:** \`${arg.name}\` must be a valid user mention.`,
              };

            args.set(arg.name, user);
            break;

          case CommandArgType.MEMBER:
            const memberPattern = /^<@!?(\d+)>$/;
            const memberId = value.match(memberPattern)?.[1];
            const member = message.guild?.members.cache.get(memberId);

            if (!memberPattern.test(value) || !member)
              return {
                valid: false,
                message: `❌  **Invalid argument:** \`${arg.name}\` must be a valid member mention.`,
              };

            args.set(arg.name, member);
            break;

          case CommandArgType.ROLE:
            const rolePattern = /^<@&(\d+)>$/;
            const roleId = value.match(rolePattern)?.[1];
            const role = message.guild?.roles.cache.get(roleId);

            if (!rolePattern.test(value) || !role)
              return {
                valid: false,
                message: `❌  **Invalid argument:** \`${arg.name}\` must be a valid role mention.`,
              };

            args.set(arg.name, role);
            break;

          case CommandArgType.CHANNEL:
            const channelPattern = /^<#(\d+)>$/;
            const channelId = value.match(channelPattern)?.[1];
            const channel = message.guild?.channels.cache.get(channelId);

            if (!channelPattern.test(value) || !channel) {
              return {
                valid: false,
                message: `❌  **Invalid argument:** \`${arg.name}\` must be a valid channel mention.`,
              };
            }

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
