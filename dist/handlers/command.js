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

// src/handlers/command.ts
var command_exports = {};
__export(command_exports, {
  default: () => command_default
});
module.exports = __toCommonJS(command_exports);
var import_node_path2 = __toESM(require("path"));

// src/utils/handler.ts
var import_node_fs = __toESM(require("fs"));
var import_node_path = __toESM(require("path"));
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

// src/handlers/command.ts
var import_cli_table3 = __toESM(require("cli-table3"));
var commandsPath = import_node_path2.default.join(process.cwd(), "dist", "app", "commands");
var CommandHandler = async (client) => {
  const commands = await loadFiles(commandsPath);
  const table = new import_cli_table3.default({ head: ["Group", "Name", "Status"] });
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
