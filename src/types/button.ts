import { ButtonInteraction } from "discord.js";
import { DJBClient } from "../djb";

export type ButtonConfig = {};

/**
 * Button execute function
 */
export type ButtonExecute = (
  client: DJBClient,
  interaction: ButtonInteraction
) => void;

export type Button = {
  config?: ButtonConfig;
  execute: ButtonExecute;
};
