import path from "node:path";
import { loadFiles } from "../utils/handler";
import CliTable3 from "cli-table3";
import { Command } from "@/src/types/command";
import { DJBClient } from "../djb";

const CommandHandler = async (client: DJBClient, appPath: string) => {
  const commandsPath = path.join(appPath, "commands");
  const commands = await loadFiles<Command>(commandsPath);
  const table = new CliTable3({ head: ["Group", "Name", "Status"] });

  for (const command of commands) {
    const { data, name, parent } = command;

    if (!data?.config?.description) {
      table.push([
        parent,
        `${name}`,
        "❌ Missing required 'description' config property",
      ]);
      continue;
    }

    if (!data?.execute) {
      table.push([
        parent,
        `${name}`,
        "❌ Missing required default execute function",
      ]);
      continue;
    }

    client.commands?.set(name, data);

    table.push([parent, `${name}`, "✅ Loaded"]);
  }

  console.log("\n=== Commands ===");
  console.log(table.toString());
};

export default CommandHandler;
