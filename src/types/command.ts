import {
  BitFieldResolvable,
  Channel,
  Collection,
  GuildMember,
  Message,
  OmitPartialGroupDMChannel,
  PermissionsString,
  Role,
  User,
} from "discord.js";
import { DJBClient } from "../djb";

export interface CommandConfig {
  description: string;
  args?: CommandArg[];
  permissions?: BitFieldResolvable<PermissionsString, number>[];
  roles?: string[];
  ownersOnly?: boolean;
}

// Args
export enum CommandArgType {
  STRING,
  NUMBER,
  BOOLEAN,
  TIME,
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
  : T extends CommandArgType.TIME
  ? number
  : T extends CommandArgType.USER
  ? User
  : T extends CommandArgType.MEMBER
  ? GuildMember
  : T extends CommandArgType.ROLE
  ? Role
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
export type CommandExecute = (
  client: DJBClient,
  message: OmitPartialGroupDMChannel<Message>,
  commandName: string,
  args: Collection<string, any>
) => void;

export type Command = {
  config: CommandConfig;
  execute: CommandExecute;
};
