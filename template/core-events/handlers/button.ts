import { EventConfig, EventExecute } from "@/src/types/event";
import { validateButton } from "@/src/utils/validators/button";
import { log } from "@ad1m/logger";
import { Events } from "discord.js";

export const config: EventConfig = {
  name: Events.InteractionCreate,
};

const ButtonHandler: EventExecute<Events.InteractionCreate> = async (
  client,
  interaction
) => {
  if (!interaction.isButton()) return;

  const [customId, authorId] = interaction.customId.split("_");

  const button = client.buttons?.get(customId);

  if (!button)
    return await interaction.reply({
      flags: ["Ephemeral"],
      content: "❌  **Error**: This button dosen't exist!",
    });

  const validButton = await validateButton(authorId, interaction);

  if (!validButton.valid && validButton.message)
    return await interaction.reply({
      content: validButton.message,
      flags: ["Ephemeral"],
    });
  else if (!validButton.valid) return;

  try {
    await button.execute(client, interaction);
  } catch (error) {
    log.error(
      "button-execute",
      `Failed to execute button: ${interaction.customId}`
    );
    console.error(error);
  }
};

export default ButtonHandler;
