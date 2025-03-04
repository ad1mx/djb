import path from "node:path";
import { loadFiles } from "../utils/handler";
import CliTable3 from "cli-table3";
import { Modal } from "../types/modal";
import { DJBClient } from "../djb";

const ModalHandler = async (client: DJBClient, appPath: string) => {
  const modalsPath = path.join(appPath, "modals");
  const modals = await loadFiles<Modal>(modalsPath);
  const table = new CliTable3({ head: ["Group", "Name", "Status"] });

  for (const modal of modals) {
    const { data, name, parent } = modal;

    if (!data?.execute) {
      table.push([
        parent,
        `${name}`,
        "❌ Missing required default execute function",
      ]);
      continue;
    }

    client.modals?.set(name, data);

    table.push([parent, `${name}`, "✅ Loaded"]);
  }

  console.log("\n=== Modals ===");
  console.log(table.toString());
};

export default ModalHandler;
