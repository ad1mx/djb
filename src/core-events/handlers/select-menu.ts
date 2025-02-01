import { EventConfig, EventExecute } from "@/src/types/event";
import { Events } from "discord.js";

export const config: EventConfig = {
  name: Events.InteractionCreate,
};

const SelectMenuHandle: EventExecute<Events.InteractionCreate> = (
  c,
  interaction
) => {
  if (!interaction.isAnySelectMenu()) return;

  console.log(interaction.values);
};

export default SelectMenuHandle;
