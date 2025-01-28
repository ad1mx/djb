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

// src/lib/mongo.ts
var mongo_exports = {};
__export(mongo_exports, {
  connectToDb: () => connectToDb
});
module.exports = __toCommonJS(mongo_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  connectToDb
});
