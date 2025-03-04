import path from "node:path";
import { loadFiles } from "../utils/handler";
import CliTable3 from "cli-table3";
import { Event } from "@/src/types/event";
import { getCurrenDir } from "../utils/url.js";
import { DJBClient } from "../djb";

const EventHandler = async (client: DJBClient, appPath: string) => {
  const internalEventsPath = path.join(getCurrenDir(), "..", "core-events");
  const eventsPath = path.join(appPath, "events");
  const internalEvents = await loadFiles<Event>(internalEventsPath);
  const events = await loadFiles<Event>(eventsPath);
  const table = new CliTable3({
    head: ["Group", "Name", "Event", "Status"],
  });

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
