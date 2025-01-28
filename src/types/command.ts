import {
  BitFieldResolvable,
  Message,
  OmitPartialGroupDMChannel,
  PermissionsString,
} from "discord.js";
import { Client } from "./client";

export interface CommandArg {
  name: string;
  description: string;
  type?: "string" | "number" | "boolean" | "user";
  required?: boolean;
}

export interface CommandConfig {
  description: string;
  args?: CommandArg[];

  /**
   * List of required permissions to execute command
   */
  permissions?: BitFieldResolvable<PermissionsString, number>[];

  /**
   * List of role ID's that are allowed to execute command
   */
  roles?: string[];

  /**
   * If true, Only developer can execute command
   */
  dev?: boolean;
}

export type CommandExecute = (
  client: Client,
  message: OmitPartialGroupDMChannel<Message>,
  commandName: string,
  args: Map<string, string>
) => void;

export type Command = {
  config: CommandConfig;
  execute: CommandExecute;
};
