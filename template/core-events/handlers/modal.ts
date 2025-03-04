import { EventConfig, EventExecute } from "@/src/types/event";
import { validateModal } from "@/src/utils/validators/modal";
import { log } from "@ad1m/logger";
import { Events } from "discord.js";

export const config: EventConfig = {
  name: Events.InteractionCreate,
};

const ModalHandler: EventExecute<Events.InteractionCreate> = async (
  client,
  interaction
) => {
  if (!interaction.isModalSubmit()) return;

  const modal = client.modals?.get(interaction.customId);

  if (!modal)
    return await interaction.reply({
      flags: ["Ephemeral"],
      content: "❌  **Error**: This modal dosen't exist!",
    });

  const validModal = await validateModal(
    client,
    interaction,
    modal.config,
    client.config
  );

  if (!validModal.valid && validModal.message)
    return await interaction.reply({
      content: validModal.message,
      flags: ["Ephemeral"],
    });
  else if (!validModal.valid) return;

  try {
    await modal.execute(client, interaction.fields, interaction);
  } catch (error) {
    log.error(
      "modal-execute",
      `Failed to execute modal: ${interaction.customId}`
    );
    console.error(error);
  }
};

export default ModalHandler;
