import "discord.js";

declare module "discord.js" {
  interface Client {
    adam?: string[];
  }
}
