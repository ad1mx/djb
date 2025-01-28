import {
  loadFiles
} from "../chunk-6TLBDZDO.mjs";
import {
  getCurrenDir
} from "../chunk-L7GWEIC4.mjs";

// src/handlers/event.ts
import path from "node:path";
import CliTable3 from "cli-table3";
var eventsPath = path.join(process.cwd(), "dist", "app", "events");
var internalEventsPath = path.join(getCurrenDir(), "..", "app", "events");
var EventHandler = async (client) => {
  const table = new CliTable3({
    head: ["Group", "Name", "Event", "Status"]
  });
  const internalEvents = await loadFiles(internalEventsPath);
  const events = await loadFiles(eventsPath);
  for (const event of [...internalEvents, ...events]) {
    const { data, name, parent } = event;
    if (!data?.config?.name) {
      table.push([
        parent,
        `${name}`,
        "?",
        "\u274C Missing required 'name' config property"
      ]);
      continue;
    }
    if (!data?.execute) {
      table.push([
        parent,
        `${name}`,
        data.config.name,
        "\u274C Missing required default execute function"
      ]);
      continue;
    }
    if (data.config.once)
      client.once(data.config.name, (...args) => data.execute(client, ...args));
    else
      client.on(data.config.name, (...args) => data.execute(client, ...args));
    table.push([parent, `${name}`, data.config.name, "\u2705 Loaded"]);
  }
  console.log("\n=== Events ===");
  console.log(table.toString());
};
var event_default = EventHandler;
export {
  event_default as default
};
