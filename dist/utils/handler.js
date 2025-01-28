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

// src/utils/handler.ts
var handler_exports = {};
__export(handler_exports, {
  getClientConfig: () => getClientConfig,
  initHandlers: () => initHandlers,
  loadFiles: () => loadFiles
});
module.exports = __toCommonJS(handler_exports);
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
var getClientConfig = async () => {
  const configPath = import_node_path.default.join(process.cwd(), "dist", "config.js");
  if (!import_node_fs.default.existsSync(configPath)) return;
  const config = await import(configPath);
  const resolvedConfig = config.default.config ?? config.config;
  return resolvedConfig;
};
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getClientConfig,
  initHandlers,
  loadFiles
});
