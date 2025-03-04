import { validateSelectMenu } from "@/src/utils/validators/select-menu";
import { log } from "@ad1m/logger";
import { Events } from "discord.js";

export const config: EventConfig = {
  name: Events.InteractionCreate,
};

const SelectMenuHandler: EventExecute<Events.InteractionCreate> = async (
  client,
  interaction
) => {
  if (!interaction.isAnySelectMenu()) return;

  const [customId, authorId] = interaction.customId.split("_");

  const selectMenu = client.selectMenus?.get(customId);

  if (!selectMenu) return;
  // return await interaction.reply({
  //   flags: ["Ephemeral"],
  //   content: "❌  **Error**: This select menu dosen't exist!",
  // });

  const validSelectMenu = await validateSelectMenu(
    client,
    customId,
    authorId,
    interaction,
    selectMenu.config,
    client.config
  );

  if (!validSelectMenu.valid && validSelectMenu.message)
    return await interaction.reply({
      content: validSelectMenu.message,
      flags: ["Ephemeral"],
    });
  else if (!validSelectMenu.valid) return;

  try {
    await selectMenu.execute(client, interaction.values, interaction);
  } catch (error) {
    log.error(
      "select-menu-execute",
      `Failed to execute select menu: ${interaction.customId}`
    );
    console.error(error);
  }
};

export default SelectMenuHandler;
