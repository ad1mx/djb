import {
  BitFieldResolvable,
  Channel,
  GuildMember,
  Message,
  OmitPartialGroupDMChannel,
  PermissionsString,
  User,
} from "discord.js";
import { Client } from "./client";

export interface CommandConfig {
  description: string;
  args?: CommandArg[];
  permissions?: BitFieldResolvable<PermissionsString, number>[];
  roles?: string[];
  dev?: boolean;
}

// Args
export enum CommandArgType {
  STRING,
  NUMBER,
  BOOLEAN,
  USER,
  MEMBER,
  ROLE,
  CHANNEL,
}

type ResolvedType<T> = T extends CommandArgType.STRING
  ? string
  : T extends CommandArgType.NUMBER
  ? number
  : T extends CommandArgType.BOOLEAN
  ? boolean
  : T extends CommandArgType.USER
  ? User
  : T extends CommandArgType.MEMBER
  ? GuildMember
  : T extends CommandArgType.CHANNEL
  ? Channel
  : string;

export interface CommandArg {
  name: string;
  description: string;
  type?: CommandArgType;
  required?: boolean;
}

// Execute function
export type CommandExecute<C extends CommandConfig = CommandConfig> = (
  client: Client,
  message: OmitPartialGroupDMChannel<Message>,
  commandName: string,
  args: Map<string, any>,
  argsObject?: any
) => void;

export type Command = {
  config: CommandConfig;
  execute: CommandExecute;
};

//
const config: CommandConfig = {
  description: "",
  args: [
    {
      name: "user",
      description: "the user",
      type: CommandArgType.BOOLEAN,
    },
    {
      name: "channel",
      description: "the channel",
      type: CommandArgType.CHANNEL,
    },
  ],
};

const exec: CommandExecute<typeof config> = (c, msg, cmd, args, argsObject) => {
  // argsObject.user; // ResolvedUser
  // argsObject.channel; // Channel
};
