import { DJBClient, ClientConfig } from "@/src/djb";
import { SelectMenuConfig } from "@/src/types/select-menu";
import { AnySelectMenuInteraction } from "discord.js";

type ValidateSelectMenuResponse =
  | { valid: false; message: string }
  | { valid: false; message?: undefined }
  | { valid: true };

export const validateSelectMenu = async (
  client: DJBClient,
  customId: string,
  authorId: string,
  interaction: AnySelectMenuInteraction,
  config?: SelectMenuConfig,
  clientConfig?: ClientConfig
): Promise<ValidateSelectMenuResponse> => {
  if (authorId && interaction.user.id !== authorId)
    return {
      valid: false,
      message: "❌  Your are not allowed to use this menu!",
    };

  return { valid: true };
};
