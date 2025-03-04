import { ModalSubmitInteraction } from "discord.js";
import { DJBClient } from "../djb";

export type ModalConfig = {};

/**
 * Modal execute function
 */
export type ModalExecute = (
  client: DJBClient,
  fields: ModalSubmitInteraction["fields"],
  interaction: ModalSubmitInteraction
) => void;

export type Modal = {
  config?: ModalConfig;
  execute: ModalExecute;
};
