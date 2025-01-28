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

// src/app/events/djb-events/prefix-command.ts
var prefix_command_exports = {};
__export(prefix_command_exports, {
  config: () => config,
  default: () => prefix_command_default
});
module.exports = __toCommonJS(prefix_command_exports);

// src/utils/handler.ts
var import_node_fs = __toESM(require("fs"));
var import_node_path = __toESM(require("path"));
var getClientConfig = async () => {
  const configPath = import_node_path.default.join(process.cwd(), "dist", "config.js");
  if (!import_node_fs.default.existsSync(configPath)) return;
  const config2 = await import(configPath);
  const resolvedConfig = config2.default.config ?? config2.config;
  return resolvedConfig;
};

// src/lib/logger.ts
var Logger = class {
  chalkTemplate;
  constructor() {
    this.loadChalkTemplate();
  }
  async loadChalkTemplate() {
    this.chalkTemplate = (await import("chalk-template")).default;
  }
  formatTimestamp(time) {
    return time.toLocaleTimeString("en", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).concat(`.${String(time.getMilliseconds()).padStart(3, "0")}`);
  }
  async log(color, title, message) {
    const now = /* @__PURE__ */ new Date();
    const timestamp = this.formatTimestamp(now);
    if (!this.chalkTemplate) await this.loadChalkTemplate();
    const templateString = this.chalkTemplate`{grey ${timestamp}} {${color} [${title}]}: ${message}`;
    console.log(templateString);
  }
  async info(title, message) {
    await this.log("blue", title, message);
  }
  async success(title, message) {
    await this.log("green", title, message);
  }
  async warn(title, message) {
    await this.log("yellow", title, message);
  }
  async error(title, message) {
    await this.log("red", title, message);
  }
};
var log = new Logger();

// src/app/events/djb-events/prefix-command.ts
var import_discord = require("discord.js");
var config = {
  name: import_discord.Events.MessageCreate
};
var OnPrefixCommand = async (client, message) => {
  const { content: msg } = message;
  const config2 = await getClientConfig();
  if (message.author.bot || !config2?.prefix || !msg.startsWith(config2.prefix))
    return;
  const splitedMessage = message.content.split(" ");
  const commandName = splitedMessage.shift()?.toLowerCase().slice(config2.prefix.length);
  if (!commandName) return;
  const command = client.commands?.get(commandName);
  if (!command) return;
  const { args, dev, permissions, roles } = command.config;
  if (dev && config2.developerIDs && !config2.developerIDs.includes(message.author.id))
    return;
  const parsedArgs = args?.reduce(
    (map, arg, i) => map.set(arg.name, splitedMessage[i] ?? void 0),
    /* @__PURE__ */ new Map()
  );
  try {
    command.execute(client, message, commandName, parsedArgs || /* @__PURE__ */ new Map());
  } catch (error) {
    log.error("command-execute", `Failed to execute command: ${commandName}`);
  }
};
var prefix_command_default = OnPrefixCommand;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  config
});
