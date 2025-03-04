import path from "node:path";
import { loadFiles } from "../utils/handler";
import CliTable3 from "cli-table3";
import { Button } from "../types/button";
import { DJBClient } from "../djb";

const ButtonHandler = async (client: DJBClient, appPath: string) => {
  const buttonsPath = path.join(appPath, "buttons");
  const buttons = await loadFiles<Button>(buttonsPath);
  const table = new CliTable3({ head: ["Group", "Name", "Status"] });

  for (const button of buttons) {
    const { data, name, parent } = button;

    if (!data?.execute) {
      table.push([
        parent,
        `${name}`,
        "❌ Missing required default execute function",
      ]);
      continue;
    }

    client.buttons?.set(name, data);

    table.push([parent, `${name}`, "✅ Loaded"]);
  }

  console.log("\n=== Buttons ===");
  console.log(table.toString());
};

export default ButtonHandler;
