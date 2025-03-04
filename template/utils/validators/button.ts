import { ButtonInteraction } from "discord.js";

type ValidateButtonResponse =
  | { valid: false; message: string }
  | { valid: false; message?: undefined }
  | { valid: true };

export const validateButton = async (
  authorId: string,
  interaction: ButtonInteraction
): Promise<ValidateButtonResponse> => {
  if (authorId && interaction.user.id !== authorId)
    return {
      valid: false,
      message: "❌  Your are not allowed to use this button!",
    };

  return { valid: true };
};
