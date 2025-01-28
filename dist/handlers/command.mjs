import {
  loadFiles
} from "../chunk-6TLBDZDO.mjs";
import "../chunk-L7GWEIC4.mjs";

// src/handlers/command.ts
import path from "node:path";
import CliTable3 from "cli-table3";
var commandsPath = path.join(process.cwd(), "dist", "app", "commands");
var CommandHandler = async (client) => {
  const commands = await loadFiles(commandsPath);
  const table = new CliTable3({ head: ["Group", "Name", "Status"] });
  for (const command of commands) {
    const { data, name, parent } = command;
    if (!data?.config?.description) {
      table.push([
        parent,
        `${name}`,
        "\u274C Missing required 'description' config property"
      ]);
      continue;
    }
    if (!data?.execute) {
      table.push([
        parent,
        `${name}`,
        "\u274C Missing required default execute function"
      ]);
      continue;
    }
    client.commands?.set(name, data);
    table.push([parent, `${name}`, "\u2705 Loaded"]);
  }
  console.log("\n=== Commands ===");
  console.log(table.toString());
};
var command_default = CommandHandler;
export {
  command_default as default
};
