import { AnySelectMenuInteraction } from "discord.js";
import { DJBClient } from "../djb";

export type SelectMenuConfig = {};

/**
 * Select menu execute function
 */
export type SelectMenuExecute = (
  client: DJBClient,
  values: AnySelectMenuInteraction["values"],
  interaction: AnySelectMenuInteraction
) => void;

export type SelectMenu = {
  config?: SelectMenuConfig;
  execute: SelectMenuExecute;
};
