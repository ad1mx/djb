#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// package.json
var version = "1.0.0-28";
var description = "";

// src/bin/djb.ts
var import_commander = require("commander");

// src/djb.ts
var import_config = require("dotenv/config");
var import_discord2 = require("discord.js");
var import_express = __toESM(require("express"));
var import_http = require("http");

// src/lib/mongo.ts
var import_mongoose = __toESM(require("mongoose"));

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

// src/lib/mongo.ts
var connectToDb = async (uri) => {
  try {
    const c = await import_mongoose.default.connect(uri, { connectTimeoutMS: 5e4 });
    log.success(
      "mongodb",
      `Connected to database '${c.connection.name}' successfully.`
    );
  } catch (error) {
    log.error("mongodb", error);
  }
};

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
var initHandlers = async (client) => {
  const handlersPath = import_node_path.default.join(getCurrenDir(), "handlers");
  if (!import_node_fs.default.existsSync(handlersPath)) {
    return [];
  }
  const handlerFiles = import_node_fs.default.readdirSync(handlersPath).filter((v) => v.endsWith(".js"));
  for (const handlerFile of handlerFiles) {
    const filePath = import_node_path.default.join(handlersPath, handlerFile);
    const {
      default: { default: handler }
    } = await import(filePath);
    await handler(client);
  }
};

// src/types/client.ts
var import_discord = require("discord.js");
var Client = class extends import_discord.Client {
  commands;
};

// src/djb.ts
var DJBClient = class {
  client;
  app;
  server;
  djbOptions;
  constructor(options, djbOptions) {
    this.client = new Client(options);
    this.djbOptions = djbOptions;
    this.app = (0, import_express.default)();
    this.server = (0, import_http.createServer)(this.app);
  }
  setupServer() {
    this.app.get("/", (req, res) => {
      res.send("Hello world!");
    });
    const port = process.env.DJB_PORT || 3e3;
    this.server.listen(port, () => {
      log.success("server", `App is running on port '${port}'`);
    });
  }
  setupClient() {
    this.client.commands = new import_discord2.Collection();
    initHandlers(this.client);
  }
  setupDatabase() {
    if (!process.env.DJB_MONGODB_URI)
      throw new Error("MONGODB_URI env must be provided when mongoDb is true");
    connectToDb(process.env.DJB_MONGODB_URI ?? "");
  }
  start() {
    this.setupServer();
    if (this.djbOptions?.mongoDb) this.setupDatabase();
    this.setupClient();
    if (!process.env.DJB_TOKEN)
      throw new Error("DJB_TOKEN env must be provided");
    this.client.login(process.env.DJB_TOKEN);
  }
};

// src/cli/djb-start.ts
var djbStart = () => {
  log.info("djb", "Starting bot...");
  const client = new DJBClient({ intents: [] }, { mongoDb: true });
  client.start();
};

// src/cli/djb-create.ts
var djbCreate = (projectName) => {
};

// src/bin/djb.ts
import_commander.program.version(version).description(description);
import_commander.program.command("start").description("Start the bot app").action(djbStart);
import_commander.program.command("create [project-name]").description("Create a new DJB project").action((projectName) => {
  djbCreate(projectName);
});
import_commander.program.parse(process.argv);
