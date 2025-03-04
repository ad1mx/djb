import path from "node:path";
import { loadFiles } from "../utils/handler";
import CliTable3 from "cli-table3";
import { SelectMenu } from "@/src/types/select-menu";
import { DJBClient } from "../djb";

const SelectMenuHandler = async (client: DJBClient, appPath: string) => {
  const selectMenusPath = path.join(appPath, "select-menus");
  const selectMenus = await loadFiles<SelectMenu>(selectMenusPath);
  const table = new CliTable3({ head: ["Group", "Name", "Status"] });

  for (const selectMenu of selectMenus) {
    const { data, name, parent } = selectMenu;

    if (!data?.execute) {
      table.push([
        parent,
        `${name}`,
        "❌ Missing required default execute function",
      ]);
      continue;
    }

    client.selectMenus?.set(name, data);

    table.push([parent, `${name}`, "✅ Loaded"]);
  }

  console.log("\n=== Select Menus ===");
  console.log(table.toString());
};

export default SelectMenuHandler;
