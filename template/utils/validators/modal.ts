import { DJBClient, ClientConfig } from "@/src/djb";
import { ModalConfig } from "@/src/types/modal";
import { ModalSubmitInteraction } from "discord.js";

type ValidateModalResponse =
  | { valid: false; message: string }
  | { valid: false; message?: undefined }
  | { valid: true };

export const validateModal = async (
  client: DJBClient,
  interaction: ModalSubmitInteraction,
  config?: ModalConfig,
  clientConfig?: ClientConfig
): Promise<ValidateModalResponse> => {
  return { valid: true };
};
