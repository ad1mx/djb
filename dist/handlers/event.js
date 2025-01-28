"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/handlers/event.ts
var event_exports = {};
__export(event_exports, {
  default: () => event_default
});
module.exports = __toCommonJS(event_exports);
var import_node_path2 = __toESM(require("path"));

// src/utils/handler.ts
var import_node_fs = __toESM(require("fs"));
var import_node_path = __toESM(require("path"));

// src/utils/index.ts
var import_url = require("url");
var import_path = require("path");
var import_meta = {};
var getCurrenDir = () => {
  if (typeof __dirname !== "undefined") {
    return __dirname;
  } else if (typeof import_meta.url !== "undefined") {
    return (0, import_path.dirname)((0, import_url.fileURLToPath)(import_meta.url));
  } else {
    throw new Error("Unable to determine module type.");
  }
};

// src/utils/handler.ts
var loadFiles = async (dirPath) => {
  if (!import_node_fs.default.existsSync(dirPath)) {
    return [];
  }
  const entries = import_node_fs.default.readdirSync(dirPath, { withFileTypes: true }).filter((v) => v.isDirectory() || /\.(js)$/.test(v.name));
  const filesArr = [];
  for (const entry of entries) {
    const entryPath = import_node_path.default.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const nestedFiles = await loadFiles(entryPath);
      filesArr.push(...nestedFiles);
    } else {
      const fileData = await import(entryPath);
      const resolvedFileData = fileData.default.default ? fileData.default : fileData;
      filesArr.push({
        parent: import_node_path.default.basename(dirPath),
        name: entry.name.replace(/\.(js|mjs)$/, ""),
        data: {
          config: resolvedFileData.config,
          execute: resolvedFileData.default
        }
      });
    }
  }
  return filesArr;
};

// src/handlers/event.ts
var import_cli_table3 = __toESM(require("cli-table3"));
var eventsPath = import_node_path2.default.join(process.cwd(), "dist", "app", "events");
var internalEventsPath = import_node_path2.default.join(getCurrenDir(), "..", "app", "events");
var EventHandler = async (client) => {
  const table = new import_cli_table3.default({
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
