import path from "node:path";
import { loadFiles } from "../utils/handler";
import CliTable3 from "cli-table3";
import { Event } from "@/src/types/event";
import { Client } from "../types/client";
import { getCurrenDir } from "../utils";

const eventsPath = path.join(process.cwd(), "dist", "app", "events");
const internalEventsPath = path.join(getCurrenDir(), "..", "app", "events");

const EventHandler = async (client: Client) => {
  const table = new CliTable3({
    head: ["Group", "Name", "Event", "Status"],
  });

  const internalEvents = await loadFiles<Event>(internalEventsPath);
  const events = await loadFiles<Event>(eventsPath);

  for (const event of [...internalEvents, ...events]) {
    const { data, name, parent } = event;

    if (!data?.config?.name) {
      table.push([
        parent,
        `${name}`,
        "?",
        "❌ Missing required 'name' config property",
      ]);
      continue;
    }

    if (!data?.execute) {
      table.push([
        parent,
        `${name}`,
        data.config.name,
        "❌ Missing required default execute function",
      ]);
      continue;
    }

    if (data.config.once)
      client.once(data.config.name, (...args) => data.execute(client, ...args));
    else
      client.on(data.config.name, (...args) => data.execute(client, ...args));

    table.push([parent, `${name}`, data.config.name, "✅ Loaded"]);
  }

  console.log("\n=== Events ===");
  console.log(table.toString());
};

export default EventHandler;
